import api from './service/api.js';

const mainForm = document.getElementById('mainForm');
const selectServico = document.querySelector('[name="servico"]');
const data = document.getElementById('data');
const hora = document.getElementById('hora');
const valorServico = document.getElementById('valor');

const getSelectedOptionValue = (select) => {
    return select.options[select.selectedIndex].value
}

mainForm.addEventListener('submit', async (event) => {

    event.preventDefault();
    const idServico  = getSelectedOptionValue(selectServico);
    const observacao = document.getElementById('observacao').value;
    const urlParams = new URLSearchParams(window.location.search);
    const idPet = urlParams.get('petid');
   
    const agendamento = `${data.value} ${hora.value}:00`;

    console.log({
        idServico,
        idPet,
        agendamento,
        observacao
    });

    const response = await api.post('/agendamentos', {
        idServico,
        idPet,
        agendamento: agendamento.toString(),
        observacao
    });

    console.log(response);
    if(response){
        const toastElList = document.querySelectorAll('.toast')
        const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, {}))
        toastList.forEach(toast => toast.show());

        const mainForm = document.getElementById('mainForm');
        mainForm.reset();
    }
});

window.addEventListener('load', async(event) => {

    selectServico.setAttribute('disabled', '');
    selectServico.innerHTML = '';

    const defaultOptionElement = document.createElement('option');
    defaultOptionElement.innerText = 'Selecionar';
    defaultOptionElement.setAttribute('selected', '');
    defaultOptionElement.setAttribute('disabled', '');
    selectServico.appendChild(defaultOptionElement);

    const servicos = await api.get('/servicos');

    servicos.forEach(servico => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', servico.id);
        optionElement.dataset.valor = servico.valor;
        optionElement.innerText = servico.nome;
        selectServico.appendChild(optionElement);
    });

    selectServico.removeAttribute('disabled');
});

selectServico?.addEventListener('change', async(event) => {
    const optionSelected = event.target.options[event.target.selectedIndex];
    
    valorServico.value = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(optionSelected.dataset.valor);
});
