<template>
  <div>
    <canvas :id="props.id"></canvas>
  </div>
</template>

<script setup>
import { Chart } from "chart.js/auto";
import { ref, defineProps, computed, watch, onMounted } from "vue";

const props = defineProps(["chartData", "id", "showDefaultWeather"]);
const computedChartData = computed(() => {
  return {
    timeLabels: props.chartData.map((data) => `${data.time.getHours()}-00`),
    temperatures: props.chartData.map((data) => data.temp),
  };
});
let chartInstance;

onMounted(() => {
  createChart(
    computedChartData.value.timeLabels,
    computedChartData.value.temperatures
  );
});

watch(
  () => props.chartData,
  () => {
    chartInstance?.destroy();
    createChart(
      computedChartData.value.timeLabels,
      computedChartData.value.temperatures
    );
  }
);

function createChart(labels, temperatures) {
  const ctx = document.getElementById(`${props.id}`).getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatures,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#fff",
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (hours)",
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
        },
      },
    },
  });
}
</script>
