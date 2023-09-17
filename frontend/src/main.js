import api from './service/api.js';

const mainForm = document.getElementById('mainForm');
const selectEspecie = document.querySelector('[name="especie"]');
const selectRaca = document.querySelector('[name="raca"]');

const getSelectedOptionValue = (select) => {
    return select.options[select.selectedIndex].value
}

mainForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const responsavel = {
        nome: document.getElementById('nomeResponsavel').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        ddd: document.getElementById('ddd').value,
        telefone: document.getElementById('telefone').value,
    }

    const idResponsavel = await api.post('/responsavel', responsavel);

    const pet = {
        nome: document.getElementById('nomePet').value,
        data_nascimento: document.getElementById('dataNascimento').value,
        id_especie: getSelectedOptionValue(selectEspecie),
        raca: getSelectedOptionValue(selectRaca),
        sexo: document.querySelector('[name="sexo"]').value,
        porte: document.querySelector('[name="porte"]').value,
        peso: parseInt(document.getElementById('peso').value),
        castrado: document.querySelector('[name="castrado"]').value,
        id_responsavel: idResponsavel.id,
    }

    console.log('pet envio', pet);
    console.log('responsave envio', responsavel);

    const idPet = await api.post('/pet', pet);

    console.log('responsavel', idResponsavel);
    console.log('pet', idPet);
});

selectEspecie?.addEventListener('change', async(event) => {

    let especie = event.target.value;
    
    selectRaca.setAttribute('disabled', '');
    selectRaca.innerHTML = '';
    const defaultOptionElement = document.createElement('option');
    defaultOptionElement.innerText = 'Selecionar';
    defaultOptionElement.setAttribute('selected', '');
    defaultOptionElement.setAttribute('disabled', '');
    selectRaca.appendChild(defaultOptionElement);

    const racas = await api.get(`/raca/${especie}`);

    racas.forEach(raca => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', raca.id);
        optionElement.innerText = raca.nome;
        selectRaca.appendChild(optionElement);
    });

    selectRaca.removeAttribute('disabled');
})