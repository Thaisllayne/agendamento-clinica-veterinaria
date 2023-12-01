import api from '../../service/api.js';

window.addEventListener('load', async(event) => {
    async function cancel(id) {
        if(confirm('Você realmente deseja cancelar essa consulta?'))
            await api.get(`/agendamentos/${id}/cancelar`);
    }
    const agendamentos = await api.get('/agendamentos');
    console.log(agendamentos);  
    const table = $('#myTable').DataTable({
        data: agendamentos,
        order: [[4, 'asc']],
        columns: [
            { 
                data: 'nome',
                render: function(data, type, row){
                    return data.charAt(0).toUpperCase() + data.slice(1);
                }
            },
            { 
                data: 'telefone' ,
                render: function(data, type, row){
                    return `(${row.ddd}) ${data}`;
                }
            },
            { data: 'id_servico' },
            { data: 'observacao' },
            { 
                data: 'agendamento',
                render: function ( data, type, row ) {
                    const date = new Date(data);
                    return date.toLocaleString("pt-BR")
                }
            },
            { 
                data: 'id',
                render: function ( data, type, row ) {
                    const container = document.createElement("div");
                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add('btn', 'btn-danger', 'mx-2');
                    deleteButton.textContent = 'Cancelar';
                    deleteButton.dataset['delete'] = data;
                    const editButton = document.createElement("a");
                    editButton.setAttribute('href', `edit.html?id=${data}`);
                    editButton.classList.add('btn', 'btn-warning');
                    editButton.textContent = 'Editar';
                    container.appendChild(deleteButton);
                    container.appendChild(editButton);
                    return container.outerHTML;
                }
            },
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json',
        },
    });
    setTimeout(async() => {
        const deleteButtons = document.querySelectorAll('[data-delete]');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                cancel(e.target.dataset.delete)
                table.row( $(e.target).parents('tr') ).remove().draw();
                const toastElList = document.querySelectorAll('.toast')
                const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, {}))
                toastList.forEach(toast => toast.show());
            });
        });
    },600);
});