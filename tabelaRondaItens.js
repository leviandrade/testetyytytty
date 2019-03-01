

var listaidsSupervisoes = 0;




function SalvarRondaSupervisoes(){
    var pb = new ProgressBar();
    pb.Abrir();

    var tbodyItens = document.querySelector(".tabela-itens");

    var linhasTabela = tbodyItens.querySelectorAll(".item");

    var listaEnvio = [];

    for (var i = 0; i < linhasTabela.length; i++) {
        var valorOcorrencia = $("#lista" + [i]).attr("checked");
        var resultado;
        if (valorOcorrencia) {
            resultado = true;
        }
        else {
            resultado = false;
        }
        var Supervisoes = {
            Acao: linhasTabela[i].querySelector(".input-acao").value,
            Observacao: linhasTabela[i].querySelector(".input-observacao").value,
            Ocorrencia: resultado,
            idItem: linhasTabela[i].querySelector(".input-id").value,
            Vizualizada: 1
        };

        listaEnvio.push(Supervisoes);
    };
    Ronda.Itens = listaEnvio;

    $.ajax({
        url: "RondaMapaSupervisao/SalvarSupervisoes",
        type: 'POST',
        data: JSON.stringify(Ronda),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (dados) {
            listaidsSupervisoes = dados.ObjetoRetorno.idSupervisoes;
            $(".linkFotoFalse").removeClass("linkFotoFalse").addClass("linkFoto");
            $(".btnConcluir").css("display", "none");
            pb.Fechar();

            $(".btnFechar").css("display", "block");
        },
        error: function () {
            console.log("ocorreu uma falha");
            pb.Fechar();
        }
    });
}

//lista();
var EnumBotao = 0;
var ModalGrupo3 = new Pagina();
ModalGrupo3.VincularNomesTela("ModalGrupo3");

function AbrirModalGrupo3(name){
    var listaids = listaidsSupervisoes[name];
    ModalGrupo3.Abrir("RondaMapaSupervisao/RondaFotos?id=" + listaids);
    EnumBotao = name;

    $("#botao" + [name]).hide();
    Overlay();
    return false;
}

function FecharModalFoto() {
    $("#botao" + [EnumBotao]).show();
    ModalGrupo3.Fechar();
}

ModalGrupo3.OnInit = function () {

    $("#btnEnviarArquivo").click(function (e) {
        var p = new ProgressBar();
        p.Abrir();

        e.preventDefault();

        var frame = $("<iframe />",
        {
            "id": "RetornoImagem",
            "Name": "frmImportar",
            "style": "display: none;"
        });
        var form = $("#fRondaFotoArquivo");

        form.parent().append(frame);
        form.attr("target", "frmImportar");
        frame.load(function () {
            var tmp = $("#RetornoImagem").contents().find('body').text();
            var objeto = jQuery.parseJSON(tmp);

            if (!objeto.Valido) {
                Validar($("#rvRondaFotoArquivo"), objeto);
        } else {
            ModalGrupo3.Fechar();
            }

                p.Fechar();

            $("#RetornoImagem").remove();
        });

        form.submit();
    });
}


function lista(){
        
    $.post("RondaMapaSupervisao/Itens", function (data) {        var lista = data.ObjetoRetorno.Nome;        var listaids = data.ObjetoRetorno.id;        criarTabela(lista,listaids);
    });
}


function criarTabela(lista,listaids){
    var tbodyItens = document.querySelector(".tabela-itens");

    for (var i = 0; i < lista.length; i ++){

        //CRIAR A TR (LINHA DA TABELA)
        var tr = document.createElement("tr");
        tr.classList.add("item");
            
        //CRIAR AS COLUNAS DA LINHA
        var tdItem = document.createElement("td");
        tdItem.textContent = lista[i];

        tr.appendChild(tdItem);

        //ADICIONAR OS INPUTS
        var inputAcao = document.createElement("input");
        inputAcao.type = "text";
        inputAcao.id = lista[i].id;
        inputAcao.classList.add("input-acao");
        inputAcao.name = "Acao";

        var inputDescricao = document.createElement("input");
        inputDescricao.type = "text";
        inputDescricao.id = lista[i].id;
        inputDescricao.classList.add("input-observacao");
        inputDescricao.name = "Observacao";

            var inputOcorrencia = document.createElement("input");
        inputOcorrencia.setAttribute("type", "checkbox");
        inputOcorrencia.classList.add("input-Ocorrencia");
        inputOcorrencia.name = "Ocorrencia";
        inputOcorrencia.id = "lista" + [i];

        var inputbotao = document.createElement("a");
        inputbotao.classList.add("linkFotoFalse");
        inputbotao.setAttribute('href', "#");
        inputbotao.name = [i];
        inputbotao.setAttribute('onclick', "AbrirModalGrupo3(name)");
        inputbotao.text = ".....";
        inputbotao.id = "botao" + [i];

        var inputid = document.createElement("input");
        inputid.type = "hidden";
        inputid.id = lista[i].id;
        inputid.classList.add("input-id");
        inputid.name = "idItem";
        inputid.value = listaids[i];

        //CRIAR OS INPUTS
        var tdInputAcao = document.createElement("td");
        tdInputAcao.appendChild(inputAcao);

        var tdInputDescricao = document.createElement("td");
        tdInputDescricao.appendChild(inputDescricao);

        var tdinputOcorrencia = document.createElement("td");
        tdinputOcorrencia.appendChild(inputOcorrencia);

        var tdinputbotao = document.createElement("td");
        tdinputbotao.appendChild(inputbotao);

        var tdinputid = document.createElement("td");
        tdinputid.appendChild(inputid);

        tr.appendChild(tdInputAcao);
        tr.appendChild(tdInputDescricao);
        tr.appendChild(tdinputOcorrencia);
        tr.appendChild(tdinputbotao);
        tr.appendChild(tdinputid);

        tbodyItens.appendChild(tr);
    }
}