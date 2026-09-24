// ================================
// DADOS / LOCALSTORAGE
// ================================

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let nomes = JSON.parse(localStorage.getItem("nomes")) || [];
let historicoTorneios = JSON.parse(localStorage.getItem("historicoTorneios")) || [];
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || [];

const pagina = document.body.dataset.page;

// ================================
// CADASTRO
// ================================
if (pagina === "cadastro")
{

  const areaErro = document.getElementById("areaErro");

  function mostrarSenha() {
    const input = document.getElementById('senhaUsuario');
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  function validarCadastro(event) {
    event.preventDefault();

    try {
      const nome = document.getElementById("nomeUsuario").value.trim();
      const email = document.getElementById("emailUsuario").value.trim();
      const senha = document.getElementById("senhaUsuario").value;

      if (nome.length < 3) throw new Error("O usuário precisa ter pelo menos 3 caracteres.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Digite um e-mail válido.");
      if (senha.length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");
      if (usuarios.some(usuario => usuario.email === email)) throw new Error("Este e-mail já está cadastrado.");

 usuarios.push({ usuario: nome, email: email, senha: senha });
 localStorage.setItem("usuarios", JSON.stringify(usuarios));

      areaErro.textContent = '';
      usuarioLogado = usuarios.at(-1);
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      window.location.href = 'menuprincipal.html';

    } catch (erro) {
      areaErro.textContent = erro.message;
    }

    return false;
  }

  document.querySelector('form').addEventListener('input', function() {
    areaErro.textContent = '';
  });

}
// ================================
// LOGIN
// ================================
if (pagina === "login")
{

 function mostrarSenha() {
    const input = document.getElementById('inSenha');
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  const formLogar = document.getElementById("formLogar");
  const areaErro = document.getElementById("areaErro");


  formLogar.addEventListener('submit', function(event){

    event.preventDefault();



    try {
      const inUsuario = document.getElementById("inUsuario").value.trim();
      const inSenha = document.getElementById("inSenha").value;

      if (inUsuario === '') throw new Error("Digite seu usuário.");
      if (inSenha === '') throw new Error("Digite sua senha.");

let usuarioEncontrado = false;
let indiceEncontrado = -1;

for (let i = 0; i < usuarios.length; i++)
{
    if (inUsuario === usuarios[i].usuario && inSenha === usuarios[i].senha)
    {
        usuarioEncontrado = true;
        indiceEncontrado = i;
        break;
    }
}

if (!usuarioEncontrado)
{
    throw new Error("Usuário ou senha incorretos.");
}

      areaErro.textContent = '';
      usuarioLogado = usuarios[indiceEncontrado];
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      window.location.href = "pages/menuprincipal.html";

    } catch (erro) {
      areaErro.textContent = erro.message;
    }
  });


  formLogar.addEventListener('input', function(){
    areaErro.textContent = '';
  });

}
// ================================
// GERENCIAR JOGADORES
// ================================
if (pagina === "gerenciarjogadores")
{
      const letraUserGe = document.getElementById('letraUserGe');
    let letraPassada = usuarioLogado.usuario;
    letraPassada = letraPassada[0];
    letraUserGe.innerHTML = `${letraPassada}`;


      const formulario = document.getElementById('formulario');
      const lista = document.getElementById('lista');
      const listaQuant = document.getElementById('listaQuant');
      const listaMais = document.getElementById('listaMais');
      const listaMenos = document.getElementById('listaMenos');
      const listaMedia = document.getElementById('listaMedia');
      const listaVenceu = document.getElementById('listaVenceu');
      const listaNVenceu = document.getElementById('listaNVenceu');
 
      const areaErro = document.getElementById('areaErro');
 
      const inPesJog = document.getElementById('inPesJog');
      const inFilJog = document.getElementById('inFilJog');
 
      inPesJog.addEventListener('input', function() {
        termoPesquisa = document.getElementById('inPesJog').value;
        termoVitoria = document.getElementById('inFilJog').value;
        CarregarTabela();
      })
 
      inFilJog.addEventListener('input', function() {
        termoPesquisa = document.getElementById('inPesJog').value;
        termoVitoria = document.getElementById('inFilJog').value;
        CarregarTabela();
      })
      
 
      let termoPesquisa = "";
      let termoVitoria = "";
 
   
 
      const editarJogador = document.getElementById('editarJogador');
 
      formulario.addEventListener('submit', function(event) {
 
      event.preventDefault(); // Impede o recarregamento da página
 
      const nomeJogador = document.getElementById('nomeJogador').value.trim();
 
      if (nomeJogador == '')
      {
        areaErro.innerHTML = `<p>Nome do jogador vazio.</p>
                              <button id="fecharErro">Fechar</button>`;
        document.getElementById("fecharErro").addEventListener("click", function() {
        areaErro.innerHTML = '';
        });
        return;
      }
      else if (nomes.some(jogador => jogador.nome === nomeJogador))
      {
        areaErro.innerHTML = `<p>Jogador já existente.</p>
                              <button id="fecharErro">Fechar</button>`;
        document.getElementById("fecharErro").addEventListener("click", function() {
        areaErro.innerHTML = '';
        });
        return;
      }
      else
      {
        areaErro.innerHTML = ``;
      }
 
      try {
          
          nomes.push(
      {
          nome: nomeJogador,
          vitorias: 0
      }
          );
       localStorage.setItem("nomes", JSON.stringify(nomes));
       //salva o nome do jogador no array.
  } catch (erro) {
        areaErro.innerHTML = `<p>Não foi possivel cadastrar o jogador.</p>
                              <button id="fecharErro">Fechar</button>`;
        document.getElementById("fecharErro").addEventListener("click", function() {
        areaErro.innerHTML = '';
        });
  }
 
 
 
      CarregarTabela();
      formulario.reset();
    });
 
 
    function CarregarTabela() {
        
        lista.innerHTML = '';
      let soma = 0;
      for (i =0; i<nomes.length; i++)
      {
        soma += nomes[i].vitorias;
      }
        let media = soma / nomes.length;
        listaMedia.innerHTML = `<li class="topo">Média de Vitórias por Jogador</li>
        <li>${media}</li>`;
 
       listaQuant.innerHTML = '<li class="topo">Quantidade Jogadores</li>';
       let quantidade = nomes.length;
       let itemQuant = document.createElement("li");
       itemQuant.textContent = quantidade;
       listaQuant.appendChild(itemQuant);


       const listaVenceu = document.getElementById("listaVenceu");
       const listaNVenceu = document.getElementById("listaNVenceu");

       listaVenceu.innerHTML = '<li class="topo">Jogadores vencedores</li>';
       listaNVenceu.innerHTML = '<li class="topo">Jogadores não vencedores</li>';
        for (i = 0; i<nomes.length; i++)
       {
        if (nomes[i].vitorias > 0)
        {
          let jogadorVenceu = document.createElement("li");
          let jogadorVenceuNome = document.createElement("p");
          jogadorVenceuNome.textContent = nomes[i].nome;
          jogadorVenceu.appendChild(jogadorVenceuNome);
          listaVenceu.appendChild(jogadorVenceu);
        }
        else
        {
          let jogadorNVenceu = document.createElement("li");
          let jogadorNVenceuNome = document.createElement("p");
          jogadorNVenceuNome.textContent = nomes[i].nome;
          jogadorNVenceu.appendChild(jogadorNVenceuNome);
          listaNVenceu.appendChild(jogadorNVenceu);
        }
       }
 
 
       let maiorQuantidade = 0;
       listaMais.innerHTML = '<li class="topo">Jogador com Mais Vitórias</li>';
       for (i = 0; i<nomes.length; i++)
       {
        if (nomes[i].vitorias > maiorQuantidade)
        {
          maiorQuantidade = nomes[i].vitorias;
          let nomeMaior = nomes[i].nome;
          listaMais.innerHTML = `<li class="topo">Jogador com Mais Vitórias</li>
                                  <li>${nomeMaior}</li>`;
        }
        else if (nomes[i].vitorias == maiorQuantidade)
        {
          let nomeMaior = document.createElement("li");
          nomeMaior.textContent = nomes[i].nome;
          listaMais.appendChild(nomeMaior);
        }
       }
 
       let menorQuantidade = 10000;
       listaMenos.innerHTML = '<li class="topo">Jogador com Menos Vitórias</li>';
       for (i = 0; i<nomes.length; i++)
       {
        if (nomes[i].vitorias < menorQuantidade)
        {
          menorQuantidade = nomes[i].vitorias;
          let nomeMenor = nomes[i].nome;
          listaMenos.innerHTML = `<li class="topo">Jogador com Menos Vitórias</li>
                                  <li>${nomeMenor}</li>`;
        }
        else if (nomes[i].vitorias == menorQuantidade)
        {
          let nomeMenor = document.createElement("li");
          nomeMenor.textContent = nomes[i].nome;
          listaMenos.appendChild(nomeMenor);
        }
       }
 
  let resultadosEncontrados = 0;
  lista.innerHTML = '';
 
  for (let i = 0; i < nomes.length; i++) {
 
      const indice = i;
 
      let linha = document.createElement("tr");
 
      let colunaNome = document.createElement("td");
      colunaNome.textContent = nomes[i].nome;
 
      let colunaVitorias = document.createElement("td");
      colunaVitorias.textContent = nomes[i].vitorias;
 
      let colunaOpcoes = document.createElement("td");
 
      let botaoAlterar = document.createElement("button");
      botaoAlterar.textContent = "Alterar";
 
      let botaoExcluir = document.createElement("button");
      botaoExcluir.textContent = "Excluir";
 
      let botoes = document.createElement("div");
      botoes.className = "botoes-ex";
 
      botoes.appendChild(botaoAlterar);
      botoes.appendChild(botaoExcluir);
 
      colunaOpcoes.appendChild(botoes);
 
      linha.appendChild(colunaNome);
      linha.appendChild(colunaVitorias);
      linha.appendChild(colunaOpcoes);

      linha.addEventListener('mouseover', function() {
    linha.classList.add('negrito-hover');
});

linha.addEventListener('mouseout', function() {
    linha.classList.remove('negrito-hover');
});

linha.addEventListener('dblclick', function() {
    linha.classList.toggle('negrito-fixo');
});


      if (termoPesquisa == '')
      {
                    if (termoVitoria == '')
                   {
                   lista.appendChild(linha);
                   resultadosEncontrados++;
                   }
                   else if (termoVitoria == nomes[indice].vitorias)
                   {
                   lista.appendChild(linha);
                   resultadosEncontrados++;
                   }
      }
      else if (nomes[indice].nome.startsWith(termoPesquisa) == true)
      {
                   if (termoVitoria == '')
                   {
                   lista.appendChild(linha);
                   resultadosEncontrados++;
                   }
                   else if (termoVitoria == nomes[indice].vitorias)
                   {
                   lista.appendChild(linha);
                   resultadosEncontrados++;
                   }
      }


 
          botaoExcluir.addEventListener('click', function(){
                    try {
         nomes.splice(indice, 1);
         localStorage.setItem("nomes", JSON.stringify(nomes));
  } catch (erro) {
        areaErro.innerHTML = `<p>Não foi possivel remover o jogador.</p>
                              <button id="fecharErro">Fechar</button>`;
        document.getElementById("fecharErro").addEventListener("click", function() {
        areaErro.innerHTML = '';
        });
  }
           
           CarregarTabela();
         })

                 if (resultadosEncontrados == 0)
{
    lista.innerHTML = `<tr><td><p>Nenhum jogador encontrado</p></td></tr>`;
}
 
          botaoAlterar.addEventListener('click', function(){
 
            editarJogador.innerHTML = `
      <div class="editar-jogador">
          <p>Alterar informações de <b>${nomes[indice].nome}</b></p>
 
          <form id="formularioAlteracoes">
              <div class="linha">
                  <p>Novo Nome:</p>
                  <input id="novoNomeJogador" type="text" id="novoNomeJogador" placeholder="Ex.: Jogador Legal" required>
              </div>
 
            <div class=spaceBetween>
              <button id="confirmarAlteracoes" type="submit">Confirmar Alterações</button>
              <button id="cancelarAlteracoes">Cancelar</button>
            </div>
 
          </form>
      </div>
            `;
 
            let cancelarAlteracoes = document.getElementById("cancelarAlteracoes");
 
            cancelarAlteracoes.addEventListener('click', function(){
              editarJogador.innerHTML = '';
            })
 
            let formularioAlteracoes = document.getElementById("formularioAlteracoes");
 
            let confirmarAlteracoes = document.getElementById("confirmarAlteracoes")
 
            formularioAlteracoes.addEventListener('submit', function(event) {
              event.preventDefault();
 
              let inputNovoNome = document.getElementById("novoNomeJogador").value.trim();
 
 
      if (inputNovoNome == '')
      {
        areaErro.innerHTML = `<p>Nome do jogador vazio.</p>
                              <button id="fecharErro">Fechar</button>`;
        document.getElementById("fecharErro").addEventListener("click", function() {
        areaErro.innerHTML = '';
        });
        return;
      }
      else if (nomes.some(jogador => jogador.nome === inputNovoNome))
      {
        areaErro.innerHTML = `<p>Jogador já existente.</p>
                              <button id="fecharErro">Fechar</button>`;
        document.getElementById("fecharErro").addEventListener("click", function() {
        areaErro.innerHTML = '';
        });
        return;
      }
      else
      {
        areaErro.innerHTML = ``;
      }
 
          try {
          nomes[indice].nome = inputNovoNome;
          localStorage.setItem("nomes", JSON.stringify(nomes));
  } catch (erro) {
        areaErro.innerHTML = `<p>Não foi possivel editar o jogador.</p>
                              <button id="fecharErro">Fechar</button>`;
        document.getElementById("fecharErro").addEventListener("click", function() {
        areaErro.innerHTML = '';
        });
  }
 
 
 
 
              editarJogador.innerHTML = '';
              CarregarTabela();
            })
 
          })
 
 
 
        }
      }
 
 
CarregarTabela();
}
// ================================
// CRIAR TORNEIO
// ================================
if (pagina === "criartorneio")
{
      const letraUserCr = document.getElementById('letraUserCr');
    let letraPassada = usuarioLogado.usuario;
    letraPassada = letraPassada[0];
    letraUserCr.innerHTML = `${letraPassada}`;



 let jogadoresPorRodada;
    const rodada = document.getElementById('rodada');
    const espacoLista = document.getElementById('lista-selecionar');
    const espacoLista2 = document.getElementById('lista-selecionado');
    const menuPrincipal = document.getElementById('menu-principal');
    const areaErro2 = document.getElementById('areaErro2');
    const areaErro3 = document.getElementById('areaErro3');


    let jogselecionados = [];
    let numeroRodada = 1;

    let classificacaoAtual = [];

    let listasGeradas = 0;


    function CriarTorneio() {

      espacoLista2.innerHTML = `<ul id="listaSelecionados" class="lista-coluna"></ul>`;
      let listaSelecionados = document.getElementById('listaSelecionados');
      listaSelecionados.innerHTML = '<li class="topo"><h1>Jogadores Selecionados</h1></li>';

      espacoLista.innerHTML = `<ul id="selecionarJogador" class="lista-coluna"></ul>`
      const listaSelecionar = document.getElementById('selecionarJogador');
      const opcoes = document.getElementById('opcoes');

      listaSelecionar.innerHTML = '<li class="topo"><h1>Selecione os Jogadores</h1></li>'; //a lista começa com isso

      for (let i = 0; i < nomes.length; i++) {
        let esseNome = nomes[i].nome;
        let novoItem = document.createElement("button");
        novoItem.type = "button";
        novoItem.id = `selecionar-${esseNome}`;
        novoItem.textContent = esseNome;

        novoItem.addEventListener('click', function() {

          try {
            jogselecionados.push(esseNome);
          } catch (erro) {
            areaErro2.innerHTML = `<p>Não foi possivel selecionar o jogador.</p>
                                  <button id="fecharErro">Fechar</button>`;
            document.getElementById("fecharErro").addEventListener("click", function() {
              areaErro2.innerHTML = '';
            });
          }

          CarregarJogadoresSelecionados();
          novoItem.disabled = true;
        });

        let li = document.createElement("li");
        li.appendChild(novoItem);
        listaSelecionar.appendChild(li);
      }

      opcoes.innerHTML = `<form id="confirmarOpcoes">
        <p><h3>Jogadores por Rodada</h3></p>
                            <input
                            id="jogrod"
                            type="number"
                            placeholder="Ex.: 2"
                            >
            <br>
        <p><h3>Nome do Torneio</h3></p>
                            <input
                            id="nomtor"
                            type="text"
                            placeholder="Ex.: Torneio Legal"
                            required>
            <br><br>

      <button type="submit">Confirmar</button>
      <button id="cancelarform" type="button">Cancelar</button>
    </form>`;

      cancelarform = document.getElementById('cancelarform');
      cancelarform.addEventListener('click', function(){
        SairTorneio();
      })

      confirmform = document.getElementById('confirmarOpcoes');
      confirmform.addEventListener('submit', function(event) {
        event.preventDefault();

        if (jogselecionados.length < 2)
        {
          areaErro2.innerHTML = `<p>Selecione pelo menos 2 Jogadore Cadastrados.</p>
                                <button id="fecharErro">Fechar</button>`;
          document.getElementById("fecharErro").addEventListener("click", function() {
            areaErro2.innerHTML = '';
          });
          return;
        }
        else
        {
          areaErro2.innerHTML = ``;
        }


        const nomeAtribuido = document.getElementById('nomtor').value.trim();


        if (nomeAtribuido == '')
        {
          areaErro2.innerHTML = `<p>Nome do torneio vazio.</p>
                                <button id="fecharErro">Fechar</button>`;
          document.getElementById("fecharErro").addEventListener("click", function() {
            areaErro2.innerHTML = '';
          });
          return;
        }
        else
        {
          areaErro2.innerHTML = ``;
        }

        const jogrod = document.getElementById('jogrod').value;
        jogadoresPorRodada = Number(jogrod);

        if (jogadoresPorRodada <= 1)
        {
          areaErro2.innerHTML = `<p>Números de Jogadores por rodada insuficiente.</p>
                                <button id="fecharErro">Fechar</button>`;
          document.getElementById("fecharErro").addEventListener("click", function() {
            areaErro2.innerHTML = '';
          });
          return;
        }
        else
        {
          areaErro2.innerHTML = ``;
        }


        const nomeTorneio = document.getElementById('titulo');
        nomeTorneio.textContent = nomeAtribuido;


        const cancelarTorneio = document.createElement('button');
        cancelarTorneio.type = 'button';
        cancelarTorneio.textContent = 'Cancelar Torneio';
        cancelarTorneio.className = 'botao-cancelar';

        cancelarTorneio.addEventListener('click', function() {
          SairTorneio();
        });

        rodada.appendChild(cancelarTorneio);


    //////////////////////////////////////////////////////////// EMBARALHA O ARRAY
        for (let i = jogselecionados.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [jogselecionados[i], jogselecionados[j]] = [jogselecionados[j], jogselecionados[i]];
        }
    ///////////////////////////////////////////////////////////


        try {
          Torneio();
        } catch (erro) {
          areaErro2.innerHTML = `<p>Não foi possivel criar o torneio.</p>
                                <button id="fecharErro">Fechar</button>`;
          document.getElementById("fecharErro").addEventListener("click", function() {
            areaErro2.innerHTML = '';
          });
        }


        menuPrincipal.querySelectorAll('button, input, select, textarea').forEach(function(elemento) {
          elemento.disabled = true;
        });

      });

    }


    function CarregarJogadoresSelecionados() {

      espacoLista2.innerHTML = `<ul id="listaSelecionados" class="lista-coluna"></ul>`;
      let listaSelecionados = document.getElementById('listaSelecionados');
      listaSelecionados.innerHTML = '<li class="topo"><h1>Jogadores Selecionados</h1></li>';

      for (let i = 0; i < jogselecionados.length; i++)
      {
        let esseNomeSelecionado = jogselecionados[i];
        const indice = i;

        let botaoRemover = document.createElement("button");
        botaoRemover.type = 'button';
        botaoRemover.textContent = 'Remover';

        botaoRemover.addEventListener('click', function(){
          jogselecionados.splice(indice, 1);
          let botaoSelecionar = document.getElementById(`selecionar-${esseNomeSelecionado}`);
          botaoSelecionar.disabled = false;
          CarregarJogadoresSelecionados();
        })

        let nomeSelecionado = document.createElement("div");
        nomeSelecionado.textContent = esseNomeSelecionado;

        let novoItem = document.createElement("li");
        novoItem.appendChild(nomeSelecionado);
        novoItem.appendChild(botaoRemover);
        novoItem.className = 'li-gerenciar';

        listaSelecionados.appendChild(novoItem);
      }
    }


    function Torneio() {

      if (jogselecionados.length != 1)
      {
        let listaRodada = null;

        jogsAtual = jogselecionados;

        jogselecionados = [];

        for (let i = 0; i < jogsAtual.length; i++)
        {

          if (i % jogadoresPorRodada === 0)//criar nova lista, selecionar nova lista em listaRodada, aumentar numero da rodada
          {

            listaRodada = document.createElement('ul');
            listaRodada.id = `listaRodada${numeroRodada}`;
            listaRodada.className = "lista-coluna";
            listaRodada.innerHTML = `<li class="topo">Rodada ${numeroRodada} - Selecione o vencedor</li>`;
            listasGeradas++;

            rodada.appendChild(listaRodada);
            rodada.appendChild(document.createElement('br'));

            numeroRodada++;
          }


          let novoItem = document.createElement("button");
          novoItem.type = "button";
          novoItem.textContent = jogsAtual[i];

          novoItem.addEventListener('click', function() {
            novoItem.disabled = true;
            novoItem.className = "jogador-selecionado";
            jogselecionados.push(jogsAtual[i])

            let listaBotaoClicado = novoItem.parentElement.parentElement;
            listaBotaoClicado.querySelectorAll('button').forEach(function(botao) { //querry selector serve para "caçar" um determinado elemento
              botao.disabled = true; //forEach é, "para cada elemeto dessa lista, faça tal coisa."
              listaBotaoClicado.className = "lista-coluna desativado"

              if (botao !== novoItem) {
                classificacaoAtual.unshift(botao.textContent);
              }

            });

            if (jogselecionados.length == listasGeradas)
            {
              listasGeradas = 0;
              try {
                Torneio();
              } catch (erro) {
                areaErro3.innerHTML = `<p>Não foi possivel carregar a próxima rodada.</p>
                                      <button id="fecharErro">Fechar</button>`;
                document.getElementById("fecharErro").addEventListener("click", function() {
                  areaErro3.innerHTML = '';
                });
              }
            }
          });

          let li = document.createElement("li");
          li.appendChild(novoItem);
          listaRodada.appendChild(li);
        }

      }
      else
      {
        rodada.innerHTML += `
          <br><br><br>
          <h2 class="fonte">VENCEDOR: ${jogselecionados}</h2>
          <button id="novoTorneio">Próximo</button>
          <br><br><br>
        `;

        for (i = 0; i<nomes.length; i++)
        {
          if (nomes[i].nome === jogselecionados[0])
          {
            nomes[i].vitorias++;
            localStorage.setItem("nomes", JSON.stringify(nomes));
            console.log(nomes[i].vitorias);
          }
        }


        document.getElementById("novoTorneio").addEventListener("click", function() {

          let nomeAtribuido = document.getElementById('nomtor').value.trim();

          classificacaoAtual.unshift(jogselecionados[0]);
          historicoTorneios.push({
            nome: nomeAtribuido,
            numRodadas: numeroRodada-1,
            classificacao: classificacaoAtual
          });
           localStorage.setItem("historicoTorneios", JSON.stringify(historicoTorneios));


          location.reload();

        });
      }

    }


    // cancelar: volta para o menu principal
    function SairTorneio()
    {
      window.location.href = 'menuprincipal.html';
    }

    CriarTorneio();

}
// ================================
// HISTÓRICO
// ================================
if (pagina === "historicotorneios")
{
      const letraUserHi = document.getElementById('letraUserHi');
    let letraPassada = usuarioLogado.usuario;
    letraPassada = letraPassada[0];
    letraUserHi.innerHTML = `${letraPassada}`;

 const torneios = document.getElementById("torneio");



    function CarregarHistorico() {

      if (historicoTorneios.length == 0)
      {
        if (torneios.querySelector('.torneiocard') == null)
        {
          torneios.innerHTML = '';

          let vazio = document.createElement('div');
          vazio.className = 'torneios-vazio';

          let vazioTitulo = document.createElement('strong');
          vazioTitulo.textContent = 'Nenhum torneio finalizado ainda';

          let vazioTexto = document.createElement('p');
          vazioTexto.textContent = 'Os torneios que você concluir aparecem aqui.';

          vazio.appendChild(vazioTitulo);
          vazio.appendChild(vazioTexto);
          torneios.appendChild(vazio);
        }
        return;
      }

      torneios.innerHTML = '';

      for (let i = historicoTorneios.length - 1; i >= 0; i--) // do mais recente para o mais antigo
      {
        let torneio = historicoTorneios[i];

        let card = document.createElement('article');
        card.className = 'torneiocard';

        let foto = document.createElement('img');
        foto.className = 'fototorneio';
        foto.src = torneio.foto || '../img/torneio.png';
        foto.alt = '';

        let conteudo = document.createElement('div');
        conteudo.className = 'torneio-conteudo';

        let topo = document.createElement('div');
        topo.className = 'torneio-topo';

        let nome = document.createElement('h3');
        nome.className = 'nome';
        nome.textContent = torneio.nome;
        nome.title = torneio.nome;

        let rodadas = document.createElement('span');
        rodadas.className = 'torneio-rodadas';
        rodadas.textContent = torneio.numRodadas == 1 ? '1 rodada' : `${torneio.numRodadas} rodadas`;

        topo.appendChild(nome);
        topo.appendChild(rodadas);

        let classificacao = document.createElement('ol');
        classificacao.className = 'torneio-classificacao';

        for (let j = 0; j < torneio.classificacao.length; j++)
        {
          let item = document.createElement('li');

          let posicao = document.createElement('span');
          posicao.className = 'pos';
          posicao.textContent = `${j + 1}º`;

          let jogador = document.createElement('span');
          jogador.className = 'jogador';
          jogador.textContent = torneio.classificacao[j];
          jogador.title = torneio.classificacao[j];

          item.appendChild(posicao);
          item.appendChild(jogador);
          classificacao.appendChild(item);
        }

        conteudo.appendChild(topo);
        conteudo.appendChild(classificacao);

        card.appendChild(foto);
        card.appendChild(conteudo);
        torneios.appendChild(card);
      }

    }


    CarregarHistorico();

}
// ================================
// MENU PRINCIPAL
// ================================
if (pagina === "menuprincipal")
{
    const letraUserMe = document.getElementById('letraUserMe');
    let letraPassada = usuarioLogado.usuario;
    letraPassada = letraPassada[0];
    letraUserMe.innerHTML = `${letraPassada}`;

    function CarregarHistorico() {

        const torneios = document.getElementById("torneio");

        torneios.innerHTML = '';

        if (historicoTorneios.length == 0) {

            let vazio = document.createElement('div');
            vazio.className = 'torneios-vazio';

            let vazioTitulo = document.createElement('strong');
            vazioTitulo.textContent = 'Nenhum torneio finalizado ainda';

            let vazioTexto = document.createElement('p');
            vazioTexto.textContent = 'Os torneios que você concluir aparecem aqui.';

            vazio.appendChild(vazioTitulo);
            vazio.appendChild(vazioTexto);
            torneios.appendChild(vazio);

            return;
        }

        for (let i = historicoTorneios.length - 1; i >= 0; i--) {

            let torneio = historicoTorneios[i];

            let card = document.createElement('article');
            card.className = 'torneiocard';

            let foto = document.createElement('img');
            foto.className = 'fototorneio';
            foto.src = torneio.foto || '../img/torneio.png';
            foto.alt = '';

            let conteudo = document.createElement('div');
            conteudo.className = 'torneio-conteudo';

            let topo = document.createElement('div');
            topo.className = 'torneio-topo';

            let nome = document.createElement('h3');
            nome.className = 'nome';
            nome.textContent = torneio.nome;
            nome.title = torneio.nome;

            let rodadas = document.createElement('span');
            rodadas.className = 'torneio-rodadas';
            rodadas.textContent =
                torneio.numRodadas == 1
                ? '1 rodada'
                : `${torneio.numRodadas} rodadas`;

            topo.appendChild(nome);
            topo.appendChild(rodadas);

            let classificacao = document.createElement('ol');
            classificacao.className = 'torneio-classificacao';

            for (let j = 0; j < torneio.classificacao.length; j++) {

                let item = document.createElement('li');

                let posicao = document.createElement('span');
                posicao.className = 'pos';
                posicao.textContent = `${j + 1}º`;

                let jogador = document.createElement('span');
                jogador.className = 'jogador';
                jogador.textContent = torneio.classificacao[j];
                jogador.title = torneio.classificacao[j];

                item.appendChild(posicao);
                item.appendChild(jogador);

                classificacao.appendChild(item);
            }

            conteudo.appendChild(topo);
            conteudo.appendChild(classificacao);

            card.appendChild(foto);
            card.appendChild(conteudo);

            torneios.appendChild(card);
        }
    }

    CarregarHistorico();


}