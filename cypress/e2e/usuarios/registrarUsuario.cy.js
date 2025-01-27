const baseUrl = 'http://localhost:4200'
const apiUrl = 'http://localhost:4200/api'

describe('Caso de Uso 1: Registrar un Usuario', () => {

    beforeEach(() => {
        cy.intercept('GET', `${apiUrl}/usuarios`).as('getUsuarios');
        cy.intercept('GET', `${apiUrl}/organizaciones`).as('getOrganizaciones');
        cy.visit(`${baseUrl}/usuarios`);
        cy.wait('@getUsuarios').its('response.statusCode').should('eq', 200);
        cy.wait('@getOrganizaciones').its('response.statusCode').should('eq', 200);
    });
    
    it('Debería registrar un usuario y verificarlo en la lista', () => {

        cy.get('[data-cy=loader]').should('be.visible');
        cy.get('[data-cy=loader]').should('not.exist');

        cy.get('body').then(($body) => {
            if ($body.find('table').length > 0) {
                // Se cuentan las filas iniciales de la tabla
                cy.get('table tbody tr')
                    .its('length')
                    .then((rowCount) => {
                        // Se guarda el conteo inicial para usarlo más adelante
                        cy.wrap(rowCount).as('initialRowCount');
                    });

                // Se presiona el botón "Registrar Usuario"
                cy.get('[data-cy=registrar-usuario]').click();

                // Se muestra el formulario de carga de usuario
                cy.get('[data-cy=usuario-form]').should('be.visible');

                // Se completan los campos del formulario
                cy.get('[data-cy=apellido]').type('Pérez');
                cy.get('[data-cy=nombre]').type('Juan');
                cy.get('[data-cy=dni]').type('39597615');
                cy.get('[data-cy=email]').type('juan.perez@ejemplo.com');
                cy.get('[data-cy=username]').type('juanperez');
                cy.get('[data-cy=password]').type('unaconstrasenia123/');
                cy.get('[data-cy=organizacion]').select('Municipalidad de La Plata');

                // Se presiona el botón que envía el formulario y se intercepta la solicitud al servidor
                cy.intercept('POST', `${apiUrl}/usuarios`).as('registrarUsuario');
                cy.get('[data-cy=action-button]').click();
                cy.wait('@registrarUsuario').its('response.statusCode').should('eq', 400);
                
                // Se espera a que aparezca el SweetAlert e informa que el DNI ya se encuentra registrado
                cy.get('.swal2-container').should('be.visible');
                cy.get('.swal2-popup').should('contain', 'El DNI 39597615 ya se encuentra registrado.');
                
                // Se cierra el SweetAlert haciendo clic en el botón "Aceptar" y se asegura que desapareció
                cy.get('.swal2-confirm').click();
                cy.get('.swal2-popup').should('not.exist');

                // Se limpia y cambia el valor del campo DNI por uno aleatorio entre 15 millones y 59 millones
                let randomDNI = (Math.floor(Math.random() * (59000000 - 15000000 + 1)) + 15000000).toString();
                cy.get('[data-cy=dni]').focus().clear().type(randomDNI);

                // Se envía nuevamente el formulario y se intercepta la solicitud al servidor
                cy.intercept('POST', `${apiUrl}/usuarios`).as('registrarUsuario');
                cy.get('[data-cy=action-button]').click();
                cy.wait('@registrarUsuario').its('response.statusCode').should('eq', 200);

                // Se espera a que aparezca el SweetAlert y se verifica el mensaje de éxito dentro del mismo
                cy.get('.swal2-container').should('be.visible');
                cy.get('.swal2-popup').should('contain', 'Usuario creado correctamente');    

                // Se cierra el SweetAlert haciendo clic en el botón "Aceptar" y se asegura que desapareció
                cy.get('.swal2-confirm').click();
                cy.get('.swal2-popup').should('not.exist');

                // Se verifica que hay una fila más en el tbody y está en el listado el usuario con el dni ingresado
                cy.get('@initialRowCount').then((initialRowCount) => {
                    cy.get('table tbody tr').should('have.length', initialRowCount + 1);
                    cy.get('table tbody tr').contains(randomDNI).should('exist');
                });
            } else {
                // Se informa que no hay usuarios registrados
                cy.get('[data-cy=empty-table-message]').should('be.visible').and('contain', 'No hay usuarios aún. Aquí aparecerán los usuarios registrados.');
            }
        });
    });
});
