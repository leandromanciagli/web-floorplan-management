import { Component, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Canvas, FabricImage, Rect } from 'fabric'
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '@services/sweet-alert/sweet-alert.service';
import * as pdfjsLib from 'pdfjs-dist';
import { FormsModule } from '@angular/forms';
// import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-plano-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // NgxFileDropModule,
  ],
  providers: [
    SweetAlertService,
  ],
  templateUrl: './plano-editor.component.html',
  styleUrl: './plano-editor.component.css'
})
export class PlanoEditorComponent implements AfterViewInit {  
  @ViewChild('planoEditor') planoEditor!: ElementRef<HTMLCanvasElement>;
  @Output() croppedImage = new EventEmitter<string>();

  canvas!: Canvas;
  files: any[] = [];
  selectedImage!: any;
  selectionRect!: Rect;
  isCropping = false


  constructor(
    private swal: SweetAlertService,
  ) { }

  ngOnInit() {
    // Asigna la url del service worker para trabajar con pdfjsLib
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.mjs';
  }
  
  ngAfterViewInit(): void {
    this.canvas = new Canvas(this.planoEditor.nativeElement, {
      width: 900,
      height: 500,
      backgroundColor: '#f0f0f0',
    })

    this.canvas.preserveObjectStacking = true;

    // this.canvas.on('mouse:down', (event) => {
    //   this.onMouseDown(event)
    // });

    // this.canvas.on('mouse:move', (event) => {
    //   this.onMouseMove(event)
    // });

    // this.canvas.on('mouse:up', () => {
    //   this.onMouseUp()
    // });

    this.canvas.on('mouse:wheel', (event) => {
      this.onMouseWheel(event.e)
    });

    // this.canvas.on('mouse:dblclick', (event) => {
    //   this.prepareCrop(event.target);
    // });

    this.canvas.renderAll();
  }

  async onFilesAdded(event: any) {
    try {
      for (let addedFile of event.target.files) {
        if (addedFile.type.includes('image')) {          
          addedFile.url = URL.createObjectURL(addedFile);
          addedFile.fabricImage = await FabricImage.fromURL(addedFile.url);
          this.files.push(addedFile)
        } else if (addedFile.type === 'application/pdf') {
          let pdfPages = await this.handlePdf(addedFile)
          for (let pdfPage of pdfPages) {
            pdfPage.url = URL.createObjectURL(pdfPage);
            pdfPage.fabricImage = await FabricImage.fromURL(pdfPage.url);
            this.files.push(pdfPage)
          }
        }
      }
      if (!this.selectedImage) {
        this.selectedImage = this.files[0].fabricImage
        this.canvas.add(this.selectedImage)
        this.canvas.centerObject(this.selectedImage);
      }
    } catch(error) {
      console.log(error);
      this.swal.displayErrorMessage("Ocurrió un error al adjuntar el archivo")
    }
  }

  async handlePdf(pdfFile: File): Promise<any[]> {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(pdfFile);

    return new Promise((resolve) => {
      fileReader.onload = async () => {
        if (fileReader.result) {
          const pdf = await pdfjsLib.getDocument({ data: fileReader.result }).promise;
          const files: File[] = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context!, viewport }).promise;

            canvas.toBlob((blob) => {
              if (blob) {
                const pdfName = pdfFile.name.replace(/\.[^/.]+$/, "");
                const imageFile = new File([blob], `${pdfName}-pagina-${i}.png`, { type: "image/png" });
                files.push(imageFile);

                if (files.length === pdf.numPages) {
                  resolve(files);
                }
              }
            }, "image/png");
          }
        }
      };
    });
  }

  changeSelectedImage(event: Event) {
    const id = parseInt((event.target as HTMLSelectElement).value);
    this.selectedImage = this.files[id].fabricImage
    this.canvas.clear()
    this.canvas.backgroundColor = '#f0f0f0';
    this.canvas.add(this.selectedImage)
  }

  zoomIn() {
    if (this.selectedImage) {
      const zoomFactor = 1.1;  // Aumentar el zoom

      // Obtiene las coordenadas del centro de la imagen
      const centerX = this.selectedImage.left! + (this.selectedImage.width! * this.selectedImage.scaleX!) / 2;
      const centerY = this.selectedImage.top! + (this.selectedImage.height! * this.selectedImage.scaleY!) / 2;

      // Aplica el zoom
      this.selectedImage.scaleX *= zoomFactor;
      this.selectedImage.scaleY *= zoomFactor;

      // Ajusta la posición de la imagen para mantener el centro
      this.selectedImage.left = centerX - (this.selectedImage.width! * this.selectedImage.scaleX!) / 2;
      this.selectedImage.top = centerY - (this.selectedImage.height! * this.selectedImage.scaleY!) / 2;

      this.canvas.renderAll();
    }
  }

  zoomOut() {
    if (this.selectedImage) {
      const zoomFactor = 0.9;  // Reducir el zoom

      // Obtiene las coordenadas del centro de la imagen
      const centerX = this.selectedImage.left! + (this.selectedImage.width! * this.selectedImage.scaleX!) / 2;
      const centerY = this.selectedImage.top! + (this.selectedImage.height! * this.selectedImage.scaleY!) / 2;

      // Aplica el zoom
      this.selectedImage.scaleX *= zoomFactor;
      this.selectedImage.scaleY *= zoomFactor;

      // Ajusta la posición de la imagen para mantener el centro
      this.selectedImage.left = centerX - (this.selectedImage.width! * this.selectedImage.scaleX!) / 2;
      this.selectedImage.top = centerY - (this.selectedImage.height! * this.selectedImage.scaleY!) / 2;

      this.canvas.renderAll();
    }
  }

  onMouseWheel(event: WheelEvent) {
    if (!this.selectedImage) return;

    event.preventDefault();  // Evita el scroll de la página

    const zoomFactor = 1.1;
    const delta = event.deltaY > 0 ? 1 / zoomFactor : zoomFactor;  // Zoom In o Zoom Out

    // Obtiene coordenadas del mouse dentro del canvas
    const pointer = this.canvas.getViewportPoint(event);
    const mouseX = pointer.x;
    const mouseY = pointer.y;

    // Obtiene coordenadas de la imagen antes del zoom
    const imageX = this.selectedImage.left || 0;
    const imageY = this.selectedImage.top || 0;

    // Aplica el zoom
    this.selectedImage.scaleX *= delta;
    this.selectedImage.scaleY *= delta;

    // Ajusta la posición de la imagen para que el zoom se haga en el puntero
    this.selectedImage.left = mouseX - (mouseX - imageX) * delta;
    this.selectedImage.top = mouseY - (mouseY - imageY) * delta;

    this.canvas.renderAll();
  }

  enableCrop() {
    this.isCropping = true
    this.selectionRect = new Rect({
      fill: 'rgba(0,0,0,0.3)',
      originX: 'left',
      originY: 'top',
      stroke: 'black',
      opacity: 1,
      width: this.selectedImage.width,
      height: this.selectedImage.height,
      transparentCorners: false,
      cornerColor: 'white',
      cornerStrokeColor: 'black',
      borderColor: 'black',
      cornerSize: 12,
      padding: 0,
      cornerStyle: 'circle',
      borderDashArray: [5, 5],
      borderScaleFactor: 1.3,
      lockRotation: true,
    });

    this.selectionRect.scaleToWidth(300);
    this.canvas.centerObject(this.selectionRect);
    this.selectionRect.visible = true;
    this.canvas.add(this.selectionRect);
    this.canvas.setActiveObject(this.selectionRect);
  }

  disableCrop() {
    if (this.isCropping) {      
      this.canvas.remove(this.selectionRect);
      this.isCropping = false
      this.canvas.renderAll();
    }
  }

  cropImage() {
    if (this.isCropping) {      
      this.canvas.renderAll();

      const cropX = (this.selectionRect.left! - this.selectedImage.left!) / this.selectedImage.scaleX!;
      const cropY = (this.selectionRect.top! - this.selectedImage.top!) / this.selectedImage.scaleY!;

      const cropWidth = this.selectionRect.getScaledWidth() / this.selectedImage.scaleX!;
      const cropHeight = this.selectionRect.getScaledHeight() / this.selectedImage.scaleY!;

      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d')!;

      tempCanvas.width = cropWidth;
      tempCanvas.height = cropHeight;

      const imgElement = this.selectedImage._element; // Imagen HTML de Fabric.js

      // Dibujar la parte recortada en el canvas temporal
      ctx.drawImage(imgElement, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      // Crea la nueva imagen con el resultado
      const croppedImage = tempCanvas.toDataURL('image/jpeg', 1.0);
      
      this.croppedImage.emit(croppedImage);

      this.canvas.remove(this.selectionRect);
      this.isCropping = false
      this.canvas.renderAll();
    }
  }

















































  // onMouseDown(event: any) {
  //   console.log("MOUSE DOWN");
  // }

  // onMouseMove(event: any) {
  //   console.log("MOUSE MOVE");
  // }

  // onMouseUp() {
  //   console.log("MOUSE UP");
  // }

  // prepareCrop(e: any) {

  //   var i = new Rect({
  //     id: "crop-rect",
  //     top: e.top,
  //     left: e.left,
  //     angle: e.angle,
  //     width: e.getScaledWidth(),
  //     height: e.getScaledHeight(),
  //     stroke: "rgb(42, 67, 101)",
  //     strokeWidth: 2,
  //     strokeDashArray: [5, 5],
  //     fill: "rgba(255, 255, 255, 1)",
  //     globalCompositeOperation: "overlay",
  //     lockRotation: true,
  //   });

  //   var a = new Rect({
  //     id: "overlay-rect",
  //     top: e.top,
  //     left: e.left,
  //     angle: e.angle,
  //     width: e.getScaledWidth(),
  //     height: e.getScaledHeight(),
  //     selectable: !1,
  //     selection: !1,
  //     fill: "rgba(0, 0, 0, 0.5)",
  //     lockRotation: true,
  //   });

  //   var s = e.cropX,
  //     o = e.cropY,
  //     c = e.width,
  //     l = e.height;
  //   e.set({
  //     cropX: null,
  //     cropY: null,
  //     left: e.left - s * e.scaleX,
  //     top: e.top - o * e.scaleY,
  //     width: e._originalElement.naturalWidth,
  //     height: e._originalElement.naturalHeight,
  //     dirty: false
  //   });
  //   i.set({
  //     left: e.left + s * e.scaleX,
  //     top: e.top + o * e.scaleY,
  //     width: c * e.scaleX,
  //     height: l * e.scaleY,
  //     dirty: false
  //   });
  //   a.set({
  //     left: e.left,
  //     top: e.top,
  //     width: e.width * e.scaleX,
  //     height: e.height * e.scaleY,
  //     dirty: false
  //   });
  //   // i.oldScaleX = i.scaleX;
  //   // i.oldScaleY = i.scaleY;

  //   this.canvas.add(a),
  //   this.canvas.add(i),
  //   this.canvas.discardActiveObject(),
  //   this.canvas.setActiveObject(i),
  //   this.canvas.renderAll(),

  //   i.on("moving", function () {
  //     (i.top < e.top || i.left < e.left) &&
  //       ((i.left = i.left < e.left ? e.left : i.left),
  //         (i.top = i.top < e.top ? e.top : i.top)),
  //       (i.top + i.getScaledHeight() > e.top + e.getScaledHeight() ||
  //         i.left + i.getScaledWidth() > e.left + e.getScaledWidth()) &&
  //       ((i.top =
  //         i.top + i.getScaledHeight() > e.top + e.getScaledHeight()
  //           ? e.top + e.getScaledHeight() - i.getScaledHeight()
  //           : i.top),
  //         (i.left =
  //           i.left + i.getScaledWidth() > e.left + e.getScaledWidth()
  //             ? e.left + e.getScaledWidth() - i.getScaledWidth()
  //             : i.left));
  //   });

  //   i.on("scaling", function () {

  //   });

  //   i.on("deselected", () => {
  //     this.cropImage(i, e);
  //     this.canvas.remove(a);
  //   });
  // }

  // cropImage(i: any, e: any) {

  //   this.canvas.remove(i);

  //   var s = (i.left - e.left) / e.scaleX,
  //     o = (i.top - e.top) / e.scaleY,
  //     c = (i.width * i.scaleX) / e.scaleX,
  //     l = (i.height * i.scaleY) / e.scaleY;

  //   // crop
  //   e.set({
  //     cropX: s,
  //     cropY: o,
  //     width: c,
  //     height: l,
  //     top: e.top + o * e.scaleY,
  //     left: e.left + s * e.scaleX,
  //     selectable: true,
  //     cropped: 1
  //   });

  //   this.canvas.renderAll();

  // }

  // fileOver(droppedFiles: NgxFileDropEntry[]) {
  //   console.log(droppedFiles);
  // }

  // fileLeave(droppedFiles: NgxFileDropEntry[]) {
  //   console.log(droppedFiles);
  // }

  // onFilesAdded(event: NgxFileDropEntry[]) {
  //   const newAddedfiles: File[] = [];
  //   for (let addedFile of event) {
  //     if (addedFile.fileEntry.isFile) {
  //       const fileEntry = addedFile.fileEntry as FileSystemFileEntry;
  //       fileEntry.file((file: File) => {
  //         newAddedfiles.push(file);
  //       });
  //     }
  //   }
  //   this.files.push(...newAddedfiles);
  //   for (let file of newAddedfiles) {
  //     if (file.type.includes('image')) {
  //       this.handleImage(file);
  //     } else if (file.type === 'application/pdf') {
  //       this.handlePdf(file);
  //     }
  //   }
  // }
}
