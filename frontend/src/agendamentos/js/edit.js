import api from '../../service/api.js';

const mainForm = document.getElementById('mainForm');
const selectServico = document.querySelector('[name="servico"]');
const data = document.getElementById('data');
const hora = document.getElementById('hora');
const valorServico = document.getElementById('valor');
const observacao = document.getElementById('observacao');
const urlParams = new URLSearchParams(window.location.search);

const getSelectedOptionValue = (select) => {
    return select.options[select.selectedIndex].value
}

window.addEventListener('load', async(event) => {

    let agendamentoId = urlParams.get('id');
    let agendamento = await api.get(`/agendamentos/${agendamentoId}`);
    if(!agendamento) window.location.href = "http://127.0.0.1:5500/frontend/src/agendamentos/";
    console.log(agendamento);

    observacao.value = agendamento.observacao;
    let dataHora = new Date(agendamento.agendamento);
    console.log(dataHora.getUTCHours());
    let diaDoMes = `${dataHora.getDate()}`;
    let mes = `${dataHora.getMonth()+1}`;
    data.value = `${dataHora.getFullYear()}-${mes.padStart(2,'0')}-${diaDoMes.padStart(2,'0')}`;
    let horas = `${dataHora.getHours()}`;
    let minutos = `${dataHora.getMinutes()}`;
    hora.value = `${horas.padStart(2,'0')}:${minutos.padStart(2, '0')}`;
    
    selectServico.setAttribute('disabled', '');
    selectServico.innerHTML = '';
    let defaultOptionElement = document.createElement('option');
    defaultOptionElement.innerText = 'Selecionar';
    defaultOptionElement.setAttribute('selected', '');
    defaultOptionElement.setAttribute('disabled', '');
    selectServico.appendChild(defaultOptionElement);

    let servicos = await api.get('/servicos');

    servicos.forEach(servico => {
        let optionElement = document.createElement('option');
        optionElement.setAttribute('value', servico.id);
        optionElement.dataset.valor = servico.valor;
        optionElement.innerText = servico.nome;
        selectServico.appendChild(optionElement);
        if(servico.id === agendamento.id_servico){
            optionElement.setAttribute('selected', '');
            valorServico.value = new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            }).format(servico.valor);
        }
    });
    selectServico.removeAttribute('disabled');

});

selectServico?.addEventListener('change', async(event) => {
    let optionSelected = event.target.options[event.target.selectedIndex];
    valorServico.value = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(optionSelected.dataset.valor);
});

mainForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let idServico  = getSelectedOptionValue(selectServico);
    let agendamentoId = urlParams.get('id');
    let agendamento = `${data.value} ${hora.value}:00`;
    await api.put(`/agendamentos/${agendamentoId}`, {
        id_servico: idServico,
        agendamento: agendamento.toString(),
        observacao: observacao.value
    });
    let toastElList = document.querySelectorAll('.toast')
    let toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, {}))
    toastList.forEach(toast => toast.show());
    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/frontend/src/agendamentos/index.html";
    }, 2000);
});
