const listaExames = document.getElementById('listaExames');
const form = document.getElementById('formExame');
const infoRegistros = document.getElementById('infoRegistros');
const searchInput = document.getElementById('searchInput');
const btnLimparPesquisa = document.getElementById('btnLimparPesquisa');
const btnFiltrarAvancado = document.getElementById('btnFiltrarAvancado');
const btnEditarRegistro = document.getElementById('btnEditarRegistro');
const btnExcluirRegistro = document.getElementById('btnExcluirRegistro');
const filtroAvancadoContainer = document.getElementById('filtroAvancadoContainer');
const filtroModalidade = document.getElementById('filtroModalidade');
const dataInicio = document.getElementById('dataInicio');
const dataFim = document.getElementById('dataFim');
const btnLimparFiltroAvancado = document.getElementById('btnLimparFiltroAvancado');
const btnAplicarFiltroAvancado = document.getElementById('btnAplicarFiltroAvancado');

// Modal
const modal = document.getElementById('modalForm');
let editIndex = null;  // Para controlar o índice do registro em edição

function abrirModal() {
    modal.style.display = 'flex';
}

function fecharModal() {
    modal.style.display = 'none';
    limparCampos();
    editIndex = null;  // Limpa o índice de edição após fechar o modal
}

window.addEventListener('click', (event) => {
    if (event.target === modal) fecharModal();
});

// Função para obter data e hora local no formato "DD-MM-YYYY HH:MM"
function obterDataHoraLocal() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
}

// Atualiza a tabela de exames
function atualizarTabela(exames) {
    listaExames.innerHTML = '';
    exames.forEach((exame, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exame.nomePaciente}</td>
            <td>${exame.modalidade}</td>
            <td>${exame.observacoes}</td>
            <td>${exame.dataHoraExame}</td>
            <td>${exame.nomeTecnico}</td>
        `;
        row.dataset.index = index;
        row.addEventListener('click', function () {
            listaExames.querySelectorAll('tr').forEach(tr => tr.classList.remove('selecionado'));
            row.classList.add('selecionado');
        });
        listaExames.appendChild(row);
    });
    infoRegistros.textContent = `Exibindo ${exames.length} de ${exames.length} registros`;
}

// Salva ou edita um exame
function salvarExame(nomePaciente, modalidade, observacoes, dataHoraExame, nomeTecnico) {
    // Verifica se os campos obrigatórios estão preenchidos
    if (!nomePaciente || !modalidade || !observacoes || !nomeTecnico) {
        return;
    }

    const examesSalvos = JSON.parse(localStorage.getItem('exames')) || [];
    const novoExame = { nomePaciente, modalidade, observacoes, dataHoraExame, nomeTecnico };
    
    if (editIndex !== null) {
        // Edita o exame existente
        examesSalvos[editIndex] = novoExame;
        editIndex = null;
    } else {
        // Adiciona um novo exame
        examesSalvos.unshift(novoExame);
    }
    
    localStorage.setItem('exames', JSON.stringify(examesSalvos));
    atualizarTabela(examesSalvos);
    limparCampos();  // Limpa os campos após a criação ou edição
    fecharModal();   // Fecha o modal
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.checkValidity()) {
        const nomePaciente = form.nomePaciente.value;
        const modalidade = form.modalidade.value;
        const observacoes = form.observacoes.value;
        const dataHoraExame = form.dataHoraExame.value || obterDataHoraLocal();  // Usa data e hora local se o campo estiver vazio
        const nomeTecnico = form.nomeTecnico.value;

        salvarExame(nomePaciente, modalidade, observacoes, dataHoraExame, nomeTecnico);
    }
});

// Limpa o formulário
function limparCampos() {
    form.reset();
}

// Edição de um registro
btnEditarRegistro.addEventListener('click', () => {
    const selecionado = document.querySelector('tbody tr.selecionado');
    if (selecionado) {
        editIndex = selecionado.dataset.index;
        const examesSalvos = JSON.parse(localStorage.getItem('exames')) || [];
        const exame = examesSalvos[editIndex];

        // Preenche o formulário com os dados do exame selecionado
        form.nomePaciente.value = exame.nomePaciente;
        form.modalidade.value = exame.modalidade;
        form.observacoes.value = exame.observacoes;
        form.dataHoraExame.value = exame.dataHoraExame;
        form.nomeTecnico.value = exame.nomeTecnico;

        abrirModal(); // Abre o modal para edição
    } else {
        alert("Selecione um registro para editar.");
    }
});

// Exclusão de um registro
btnExcluirRegistro.addEventListener('click', () => {
    const selecionado = document.querySelector('tbody tr.selecionado');
    if (selecionado) {
        const index = selecionado.dataset.index;
        const examesSalvos = JSON.parse(localStorage.getItem('exames')) || [];
        examesSalvos.splice(index, 1);
        localStorage.setItem('exames', JSON.stringify(examesSalvos));
        atualizarTabela(examesSalvos);
    } else {
        alert("Selecione um registro para excluir.");
    }
});

// Pesquisa dinâmica
searchInput.addEventListener('input', () => {
    const exames = JSON.parse(localStorage.getItem('exames')) || [];
    const termo = searchInput.value.toLowerCase();
    const resultado = exames.filter(exame => 
        exame.nomePaciente.toLowerCase().includes(termo) ||
        exame.modalidade.toLowerCase().includes(termo) ||
        exame.observacoes.toLowerCase().includes(termo) ||
        exame.nomeTecnico.toLowerCase().includes(termo)
    );
    atualizarTabela(resultado);
});

btnLimparPesquisa.addEventListener('click', () => {
    searchInput.value = '';
    atualizarTabela(JSON.parse(localStorage.getItem('exames')) || []);
});

// Filtro avançado
btnFiltrarAvancado.addEventListener('click', () => {
    filtroAvancadoContainer.style.display = filtroAvancadoContainer.style.display === 'none' ? 'block' : 'none';
});

btnAplicarFiltroAvancado.addEventListener('click', () => {
    const modalidade = filtroModalidade.value.toLowerCase();
    const inicio = dataInicio.value ? new Date(dataInicio.value) : null;
    const fim = dataFim.value ? new Date(dataFim.value) : null;
    const exames = JSON.parse(localStorage.getItem('exames')) || [];
    const resultado = exames.filter(exame => {
        const data = new Date(exame.dataHoraExame);
        return (!modalidade || exame.modalidade.toLowerCase() === modalidade) &&
               (!inicio || data >= inicio) &&
               (!fim || data <= fim);
    });
    atualizarTabela(resultado);
});

btnLimparFiltroAvancado.addEventListener('click', () => {
    filtroModalidade.value = '';
    dataInicio.value = '';
    dataFim.value = '';
    atualizarTabela(JSON.parse(localStorage.getItem('exames')) || []);
});

// Função para abrir o modal de exportação
function abrirModalExportar() {
    document.getElementById("modalExportar").style.display = "block";
}

// Função para fechar o modal de exportação
function fecharModalExportar() {
    document.getElementById("modalExportar").style.display = "none";
}

// Função para exportar os registros
function exportarRegistros() {
    const registros = obterRegistros(); // Obtenha os registros da tabela
    let textoExportado = "Nome do Paciente | Modalidade | Exame Realizado | Data e Hora | Técnico\n";

    // Construa o conteúdo do arquivo com os registros
    registros.forEach(registro => {
        textoExportado += `${registro.nomePaciente}	| ${registro.modalidade} | ${registro.observacoes} | ${registro.dataHoraExame} | ${registro.nomeTecnico}\n`;
    });

    // Criar o arquivo e iniciar o download
    const blob = new Blob([textoExportado], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registros_de_exames.txt';
    link.click();

    // Fechar o modal após o download
    fecharModalExportar();
}

// Função para obter os registros da tabela
function obterRegistros() {
    const registros = [];
    const rows = document.querySelectorAll("#listaExames tr"); // Selecione todas as linhas da tabela

    rows.forEach(row => {
        const cols = row.querySelectorAll("td"); // Selecione as células de cada linha
        if (cols.length > 0) {
            // Adicione os dados dos registros ao array
            registros.push({
                nomePaciente: cols[0].innerText,
                modalidade: cols[1].innerText,
                observacoes: cols[2].innerText,
                dataHoraExame: cols[3].innerText,
                nomeTecnico: cols[4].innerText
            });
        }
    });

    return registros;
}
