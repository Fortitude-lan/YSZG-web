<template>
  <div class="">
    <div class="top">
      <div class="basic">
        <el-statistic title="用户数量" :value="datas.usernum" />
      </div>
      <div class="basic">
        <el-statistic title="在线艺术品量" :value="datas.artnum" />
      </div>
      <div class="basic">
        <el-statistic title="平台订单量" :value="datas.ordernum" />
      </div>
      <div class="basic">
        <el-statistic title="艺术品类别" :value="datas.catnum" />
      </div>
    </div>
    <div class="left">
      <div ref="chart" id="datasetMain"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import * as echarts from "echarts";
import { fetchNum } from "@/services/backServices";

const datas = reactive({
  usernum: 0,
  artnum: 0,
  catnum: 0,
  ordernum: 0,
});

const chart = ref(null);
const initChart = () => {
  // let chartDom = document.getElementById("datasetMain");
  // let myChart = echarts.init(chartDom);
  let option;
  option = {
    legend: {},
    tooltip: {
      trigger: "axis",
      showContent: true,
      textStyle: {
        align: "left", // 文字左对齐
      },
    },
    dataset: {
      source: [
        ["product", "2012", "2013", "2014", "2015", "2016", "2017"],
        ["Milk Tea", 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
        ["Matcha Latte", 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
        ["Cheese Cocoa", 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
        ["Walnut Brownie", 25.2, 37.1, 41.2, 18, 33.9, 49.1],
      ],
    },
    xAxis: { type: "category" },
    yAxis: { gridIndex: 0 },
    grid: { top: "10%" },
    series: [
      {
        type: "bar", // 柱状图
        smooth: true, // 是否平滑曲线显示。
        // 如果是 boolean 类型，则表示是否开启平滑处理。如果是 number 类型（取值范围 0 到 1），表示平滑程度，越小表示越接近折线段，反之则反。设为 true 时相当于设为 0.5。
        seriesLayoutBy: "row", // 指定 dataset 的列（column）还是行（row）映射为图形系列（series）。这件事可以使用 series.seriesLayoutBy 属性来配置。默认是按照列（column）来映射。
        emphasis: { focus: "series" }, // 折线图的高亮状态。在高亮图形时，是否淡出其它数据的图形已达到聚焦的效果。支持如下配置：
        // 'none' 不淡出其它图形，默认使用该配置。
        // 'self' 只聚焦（不淡出）当前高亮的数据的图形。
        // 'series' 聚焦当前高亮的数据所在的系列的所有图形。
      },
      {
        type: "line", // 折线/面积图
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "bar",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
    ],
  };

  // option && myChart.setOption(option);
  const myChart = echarts.init(chart.value);
  option && myChart.setOption(option);
};

//获取数据
const fetchData = async () => {
  try {
    const { usernum, artnum, ordernum, catnum } = await fetchNum();
    // 获取list信息
    datas.usernum = usernum || 0; // 更新总页数
    datas.artnum = artnum || 0; // 更新总页数
    datas.ordernum = ordernum || 0; // 更新总页数
    datas.catnum = catnum || 0; // 更新总页数
  } catch (error) {
    console.error("Failed to fetch table columns:", error);
  }
};

//echarts图表自适应方法
const resizeChart = () => {
  const myChart = echarts.init(chart.value);
  window.addEventListener(
    "resize",
    () => {
      myChart.resize();
    },
    false
  );
};
defineExpose({ resizeChart });
// 生命周期钩子，获取表头数据
onMounted(() => {
  fetchData();
  initChart();
  resizeChart();
});
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  display: flex;
  justify-content: space-around;
  .basic {
    width: calc(25% - 16px);
    height: 100px;
    box-shadow: 0px 0px 9px 0px #dedede;
    border-radius: 20px;
    padding: 10px;
    box-sizing: border-box;
  }
}
.left {
  padding: 20px 0;
  height: 300px;
  #datasetMain {
    width: 100%;
    height: 100%;
  }
}
</style>
