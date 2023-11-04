import api from '../../service/api.js';

window.addEventListener('load', async(event) => {
    const agendamentos = await api.get('/agendamentos');
    console.log(agendamentos);
    $('#myTable').DataTable({
        data: agendamentos,
        columns: [
            { data: 'id_servico' },
            { data: 'observacao' },
            { 
                data: 'agendamento',
                render: function ( data, type, row ) {
                    const date = new Date(data);
                    return date.toLocaleString("pt-BR")
                }
            },
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json',
        },
    });
});