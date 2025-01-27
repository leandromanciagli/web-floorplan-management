const baseUrl = 'http://localhost:4200'
const apiUrl = 'http://localhost:4200/api'

describe('Caso de Uso 2: Eliminar organizaciones', () => {

    beforeEach(() => {
        cy.intercept('GET', `${apiUrl}/organizaciones`).as('getOrganizaciones');
        cy.visit(`${baseUrl}/organizaciones`);
        cy.wait('@getOrganizaciones')
            .its('response')
            .then((response) => {
                cy.wrap(response.body).as('organizaciones');  // Guarda el body en un alias
            });
    });

    it('Elimina las organizaciones sin usuarios asociados. Las organización con usuarios asociados no pueden ser eliminadas.', () => {

        cy.get('[data-cy=loader]').should('be.visible');
        cy.get('[data-cy=loader]').should('not.exist');

        cy.get('body').then(($body) => {
            if ($body.find('table').length > 0) {
                cy.get('table tbody tr').each(($row, index) => {
                    cy.get('@organizaciones').then((organizaciones) => {
                        let cantOrganizaciones = organizaciones.length;
                        let organizacion = organizaciones[index];
                        if (organizacion) {
                            // Consultar usuarios asociados a la organización
                            cy.request('GET', `${apiUrl}/organizaciones/${organizacion.organizacionId}/usuarios`).then((response) => {
                                let usuarios = response.body;
                                if (usuarios.length === 0) {

                                    // Intercepta la solicitud DELETE
                                    cy.intercept('DELETE', `${apiUrl}/organizaciones/${organizacion.organizacionId}`).as('deleteOrganizacion');
                                    
                                    // Se verifica que el botón eliminar está habilitado
                                    cy.wrap($row).as('row');
                                    cy.get('@row').find('[data-cy=delete-organizacion]').as('deleteButton')
                                    cy.get('@deleteButton').should('not.be.disabled')
                                    cy.get('@deleteButton').click();

                                    // Se espera a que aparezca el SweetAlert de confirmación para eliminar la organización
                                    cy.get('.swal2-container').should('be.visible');
                                    cy.get('.swal2-popup').should('contain', 'Eliminar organización');
                                    // Se cierra el SweetAlert haciendo clic en el botón "Eliminar" y se asegura que desapareció
                                    cy.get('.swal2-confirm').click();
                                    cy.get('.swal2-popup').should('not.exist');
                                    cy.wait('@deleteOrganizacion').its('response.statusCode').should('eq', 204);

                                    // Se espera a que aparezca el SweetAlert y se verifica el mensaje de éxito dentro del mismo
                                    cy.get('.swal2-container').should('be.visible');
                                    cy.get('.swal2-popup').should('contain', 'Organización eliminada');
                                    // Se cierra el SweetAlert haciendo clic en el botón "Aceptar" y se asegura que desapareció
                                    cy.get('.swal2-confirm').click();
                                    cy.get('.swal2-popup').should('not.exist');

                                    // Se verifica que hay una fila menos en el tbody
                                    cy.get('table tbody tr').should('have.length', cantOrganizaciones - 1);
                                    cy.get('table tbody tr').contains(organizacion.organizacionId).should('not.exist');

                                } else {
                                    // Se verifica que el botón eliminar está deshabilitado
                                    cy.wrap($row)
                                        .find('[data-cy=delete-organizacion]')
                                        .should('be.visible')
                                        .should('be.disabled');
                                    cy.log("No se puede eliminar la organización: " + organizacion.nombre + ". La organización tiene usuarios asociados.")
                                }
                            });
                        } else {
                            cy.log(`No se encontró organización para la fila ${index}.`);
                        }
                    });
                });
            } else {
                // Se informa que no hay organizaciones registradas
                cy.get('[data-cy=empty-table-message]').should('be.visible').and('contain', 'No hay organizaciones aún. Aquí aparecerán las organizaciones registradas.');
            }
        });
    });
});