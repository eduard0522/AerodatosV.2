import { contadorGraficas } from "../js/contadores.js";

export const getRutas = (total, abiertas, cerradas) => {
   /* if(total>0){
    contadorGraficas(".total", total);
  }
  if(abiertas > 0){
    contadorGraficas(".abiertas", abiertas);
  }
  if(cerradas>0){
    contadorGraficas(".cerradas", cerradas); 
  }  */

  grafica1(total);
  grafica2(abiertas, cerradas);

  getReferencia();
};


/************************ Envia la solicitud a la funcion que obtiene la cantidad de cada referencia y llama a la grafica 3 para entregar los resultados de la validación ********************/

const getReferencia = async () => {
  try {
    const result = await validacionReferencias(".referencia");
    if (!result) throw Error("ha ocurrido un error inesperado");

    const {
      contratos,
      resoluciones,
      historiasClinicas,
      historiasLaborales,
      aerodromos,
    } = result;

    console.log(contratos)

    return grafica3(
      contratos,
      resoluciones,
      historiasClinicas,
      historiasLaborales,
      aerodromos
    );
  } catch (error) {
    alert(error.message);
  }
};


/********************  Valida la cantidad de cada referencia que existe  ********************/

async function validacionReferencias(elemento) {
  let contratos = 0,
    historiasClinicas = 0,
    historiasLaborales = 0,
    aerodromos = 0,
    resoluciones = 0;

  const $referencia = document.querySelectorAll(elemento);
  $referencia.forEach((element) => {
    const refLowerCase = element.textContent.toLocaleLowerCase();
    if (refLowerCase === "contratos") {
      contratos += 1;
    }
    if (refLowerCase === "historias clinicas") {
      historiasClinicas += 1;
    }
    if (refLowerCase === "historias laborales") {
      historiasLaborales += 1;
    }
    if (refLowerCase === "aerodromos") {
      aerodromos += 1;
    }

    if (refLowerCase === "resoluciones") {
      resoluciones += 1;
    }
  });
  return {
    resoluciones,
    contratos,
    historiasClinicas,
    historiasLaborales,
    aerodromos,
  };
}

function grafica1(total) {
  let dom = document.getElementById("container");
  let myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let app = {};

  let option;

  option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "0%",
      left: "center",
    },
    series: [
      {
        name: "Total Solicitudes",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [{ value: total, name: "total" }],
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
}

function grafica2(abiertas,cerradas) {
  let dom = document.getElementById("container2");
  let myChart = echarts.init(dom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let app = {};

  let option;

  option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "0%",
      left: "center",
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: cerradas, name: "cerradas" },
          { value: abiertas, name: "Abiertas" },
        ],
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
}


function grafica3(contratos,resoluciones,historiasClinicas,historiasLaborales,aerodromos) {
  var dom = document.getElementById('container3');
  var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
  });
  var app = {};
  
  var option;

  option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Referencia',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 8
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: historiasClinicas, name: 'H.C' },
          { value: contratos , name: 'Contratos' },
          { value: aerodromos, name: 'Aerodromos' },
          { value: historiasLaborales, name: 'H.L' },
          { value: resoluciones, name: 'Resoluciones' }
        ]
      }
    ]
  };

  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }

  window.addEventListener('resize', myChart.resize);
}
