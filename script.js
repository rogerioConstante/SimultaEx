//=========================================================================================\\
//  Exercício de Espelhamento de Simultaneidades v0.1                                      \\
//                                                                                         \\
//  Copyright (C)2020 Rogério Tavares Constante                                            \\
//                                                                                         \\
//  Este programa é um software livre: você pode redistribuir e/ou  modificar              \\
//  ele nos termos da GNU General Public License como publicada pela                       \\
//  Free Software Foundation, seja na versão 3 da licença, ou em qualquer outra posterior. \\
//                                                                                         \\
//  Este programa é distribuído com a intenção de que seja útil,                           \\
//  mas SEM NENHUMA GARANTIA; Veja a GNU para mais detalhes.                               \\
//                                                                                         \\
//  Uma cópia da GNU General Public License pode ser encontrada em                         \\
//  <http://www.gnu.org/licenses/>.                                                        \\
//                                                                                         \\
//=========================================================================================\\
document.addEventListener('DOMContentLoaded', () => {
    const notaButtons = document.querySelectorAll('.nota-btn');
    const verificarButton = document.getElementById('verificar-btn');
    const simultaneidadeButton = document.getElementById('simultaneidade-btn');
    const resultadoSimultaneidade = document.getElementById('resultado-simultaneidade');
    const pitchName = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];
    const cronometroElement = document.getElementById('cronometro');
    const dificuldadeSelect = document.getElementById('nivel-dificuldade');
    const nomeInput = document.getElementById('nome-input');
    let cronometroInterval;
    var pc = [], eixo, i = 0, tempo = 60, qtd = 3, tempoRestante, pontos = 0, nome = "";

    // Toggle selected class on note buttons when clicked
    notaButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
        });
    });

    // Function to get the state of note buttons
    function getSelectedNotes() {
        return Array.from(notaButtons)
            .filter(button => button.classList.contains('selected'))
            .map(button => parseInt(button.id.replace('nota', '')));
    }

    // Function to generate a set of three random notes
    function gerarNotas() {
        i++;
        // Clear all selections
        notaButtons.forEach(button => button.classList.remove('selected'));
        const notas = [];
        pc = [];
        while (pc.length < qtd) {
            const nota = Math.floor(Math.random() * 12);
            if (!pc.includes(nota)) {
                pc.push(nota);
            }
            pc.sort((a, b) => a - b);
        }
        for (var l=0;l<pc.length;l++){
            notas.push(pitchName[pc[l]]);
        }
        eixo = Math.floor(Math.random() * pc.length);
        resultadoSimultaneidade.textContent = "Selecione as notas que correspondem\n ao espelhamento da simultaneidade \n" + notas.join(', ') + ",\n com o eixo na nota " + notas[eixo] + ".";
        console.log(pc);
        iniciarCronometro();
    }

    // Function to compare selected notes with a given array
    function compararNotas(selectedNotes, targetNotes) {
        const selectedSet = new Set(selectedNotes);
        const targetSet = new Set(targetNotes);

        // Check if both sets are equal
        if (selectedSet.size !== targetSet.size) return false;
        for (let note of selectedSet) {
            if (!targetSet.has(note)) return false;
        }
        return true;
    }

    // Function to start the countdown timer
    function iniciarCronometro() {
        tempoRestante = tempo;
        cronometroElement.textContent = `${tempoRestante}s`;

        cronometroInterval = setInterval(() => {
            tempoRestante -= 1;
            cronometroElement.textContent = `${tempoRestante}s`;

            if (tempoRestante <= 0) {
                //cronometroElement.textContent = "0s";
                verificarResultado();
            }
        }, 1000);
    }

    function verificarResultado()   {
        clearInterval(cronometroInterval);
        const selectedNotes = getSelectedNotes();
        const targetNotes = calcularEspelhamento();
        const isMatch = compararNotas(selectedNotes, targetNotes);
        if (isMatch) { pontos = pontos + 10 + Math.floor(tempoRestante/10); };
            console.log(i, `${isMatch ? 'Correspondem' : 'Não correspondem'}`, pontos, "|", Math.floor(tempoRestante/10));
        if (i < 5) {
            gerarNotas();
        } else {
            alert("ESPELHAMENTO DE SIMULTANEIDADES\n\n==== Resultado ====\n\n\n" + nome + "\nNível: " + dificuldadeSelect.value + "\nPontuação: " + pontos);
        };
    };

    // Add event listener to the verificar button
    verificarButton.addEventListener('click', () => {
        verificarResultado();
    });
    // Add event listener to the simultaneidade button
    simultaneidadeButton.addEventListener('click', () => {
        nome = nomeInput.value.trim();
        if (nome == "") { alert("Erro!!\nDigite o seu nome, antes de iniciar!"); return };
        i = 0;
        // Get the selected difficulty level
        const nivel = dificuldadeSelect.value;
        switch (nivel) {
            case 1: tempo = 60; qtd = 3; return;
            case 2: tempo = 45; qtd = 3; return;
            case 3: tempo = 30; qtd = 3; return;
            case 4: tempo = 40; qtd = 4; return;
            case 5: tempo = 30; qtd = 4; return;
            case 6: tempo = 25; qtd = 4; return;
            case 7: tempo = 30; qtd = 5; return;
            case 8: tempo = 20; qtd = 5; return;
            case 9: tempo = 15; qtd = 5; return;
            case 10: tempo = 15; qtd = 6; return;
        }
        const notas = gerarNotas();
    });

    function calcularEspelhamento(){
        var rota = rotateLeft(pc, eixo); //console.log("rotação ", eixo, "->", rota );
        const espelho = [];
        var t = (rota[0] - (12 - rota[0]) % 12); //console.log("t = ", t);
        if (t < 0) t = t + 12;
        for (var x=0;x<pc.length;x++) {
            var inv = ((12 - rota[x]) + t) % 12;
            if (!espelho.includes(inv)) {
                espelho.push(inv);
            }
        }
        console.log("Espelho:", espelho);
        return espelho;
    }
    function rotateLeft(arr, times) {
        let count = times % arr.length;
        return arr.slice(count).concat(arr.slice(0, count));
    }

});
