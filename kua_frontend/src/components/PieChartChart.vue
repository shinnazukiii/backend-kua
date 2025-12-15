<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, PropType } from "vue";
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

export default defineComponent({
  name: "PieChartChart",
  props: {
    chartData: {
      type: Object as PropType<any>,
      required: true,
    },
    chartOptions: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    onMounted(() => {
      if (canvas.value) {
        chartInstance = new Chart(canvas.value, {
          type: "pie",
          data: props.chartData,
          options: props.chartOptions,
        });
      }
    });

    watch(
      () => props.chartData,
      (newData) => {
        if (chartInstance) {
          chartInstance.data = newData;
          chartInstance.update();
        }
      },
      { deep: true }
    );

    return { canvas };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 500px;
}
</style>
