<template>
  <div id="three">
    <!-- loading相关 -->
    <div class="loading">
      <div class="loading-circle"></div>
      <div class="progress"></div>
    </div>
    <div class="loading-complete display-none">
      <p clas="sv">
        <svg
          t="1677233206130"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2675"
          width="24"
          height="24"
        >
          <path
            d="M537.6 102.4c73.5744 0 142.336 20.6848 200.704 56.576 15.872 9.6256 16.7936 23.1424 2.9696 40.5504-14.08 16.2816-43.008 13.2608-86.8352-9.216l-0.0512 0.0512a318.1568 318.1568 0 1 0 104.8064 524.3904h0.3584c19.456-26.7776 40.5504-40.192 63.1296-40.2432l6.8096 0.4096c24.064 4.4032 30.4128 16.6912 19.0464 36.864l0.2048-0.3584-0.1536 0.1536-0.0512 0.2048h-0.1024l-7.936 10.5984A384 384 0 1 1 537.6 102.4z m332.288 201.0112a33.28 33.28 0 0 1 0 47.104l-276.48 276.48a31.2832 31.2832 0 0 1-0.512 0.4608l-3.584 3.584a30.72 30.72 0 0 1-43.4176 0l-1.8432-1.792-0.4096-0.512-135.3216-135.2704a30.72 30.72 0 0 1 0-43.4176l3.584-3.584a30.72 30.72 0 0 1 43.4688 0l112.2304 112.128 255.232-255.1808a33.28 33.28 0 0 1 47.104 0z"
            fill="#4efc7a"
            p-id="2676"
          ></path>
        </svg>
        加载完成
      </p>
      <!-- <p>Tips:(移动端建议开启横屏，双击屏幕开启全屏体验更佳！)</p> -->
      <button class="start">进入展馆</button>
    </div>

    <!-- css3DRenderer -->
    <div id="css"></div>

    <!-- webgl -->
    <div id="app1"></div>

    <!-- 下方气泡提示 -->
    <div class="preview-tooltip hide"></div>
    <div class="preview-tips hide">Tips：点击此画可查看详情</div>

    <!-- 画框详情框 -->
    <div class="boards-info" style="visibility: hidden">
      <div class="boards-container hide">
        <div class="content">
          <section class="info">
            <div class="title"></div>
            <div class="author"></div>
            <div class="describe"></div>
          </section>
          <section class="img">
            <img src="" alt="" />
          </section>
        </div>
        <div class="close boards-info-close"></div>
      </div>
    </div>

    <!-- 操作指引弹窗 -->
    <div class="help" title="帮助">?</div>
    <div class="operating-intro display-none">
      <h2>操作指引</h2>
      <!-- <img class="operating-intro-img" src="/operating.png" alt="" /> -->
      <div class="close operating-intro-close" title="关闭"></div>
    </div>
    <div class="music" title="音乐">音</div>
    <div class="menu">
      <input type="checkbox" class="checkbox" />
      <span class="button-menu"></span>
      <button class="option-a option">A</button>
      <button class="option-b option">B</button>
      <button class="option-c option">C</button>
    </div>
    <!-- 虚拟摇杆 -->
    <div id="joystick"></div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from "vue";
import Core from "@/components/exhibition/core";
export default {
  setup() {
    let core = null;

    onMounted(() => {
      if (core) {
        console.log("销毁旧的 Core 实例");
        core.destroy(); // 清理旧的实例
      }
      console.log("创建新的 Core 实例");
      core = new Core(); // 创建新的 Core 实例
      console.log("开始加载");
      core.render(); // 渲染
    });
    onBeforeUnmount(() => {
      if (core) {
        console.log("组件卸载，清理 Core 实例");
        core.destroy(); // 清理实例
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.menu {
  position: absolute;
  width: 40px;
  z-index: 999;
  right: 10px;
  bottom: 5rem;
  .button-menu {
    cursor: pointer;
    position: absolute;

    background-color: #ffdd00;
    border: 2px solid #1e1e1e;
    color: #1e1e1e;
    font-size: 30px;
    font-weight: 700;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    -webkit-box-shadow: 0px 3px 10px 0px rgba(16, 16, 16, 0.5);
    -moz-box-shadow: 0px 3px 10px 0px rgba(16, 16, 16, 0.5);
    box-shadow: 0px 3px 10px 0px rgba(16, 16, 16, 0.5);
  }

  .checkbox {
    position: absolute;
    width: 40px;
    height: 40px;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
  }

  .option {
    position: absolute;
    background-color: #1e1e1e;
    border: 2px solid #ffdd00;
    color: #ffdd00;
    z-index: -1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-weight: 700;
    transition: all 0.3s;
    -webkit-box-shadow: 3px 3px 10px 0px rgba(16, 16, 16, 0.5);
    -moz-box-shadow: 3px 3px 10px 0px rgba(16, 16, 16, 0.5);
    box-shadow: 3px 3px 10px 0px rgba(16, 16, 16, 0.5);
  }

  .checkbox:hover ~ .button-menu,
  .checkbox:checked ~ .button-menu {
    background-color: #eccd00;
    scale: 0.98;
    box-shadow: none;
  }

  .checkbox:not(:checked) ~ .button-menu::before {
    content: "+";
  }

  .checkbox:checked ~ .button-menu::after {
    content: "-";
    scale: 0.98;
    box-shadow: none;
  }

  .checkbox:not(:checked) ~ .option {
    box-shadow: none;
  }

  .option:hover,
  .option:active,
  .option:focus {
    box-shadow: none;
    scale: 0.98;
  }

  .checkbox:checked ~ .option-a {
    transition-delay: 0.1s;
    transform: translateY(-70px);
  }

  .checkbox:checked ~ .option-b {
    transition-delay: 0.2s;
    transform: translateY(-140px);
  }

  .checkbox:checked ~ .option-c {
    transition-delay: 0.3s;
    transform: translateY(-210px);
  }
}
.start {
  --😀: #644dff;
  --😀😀: #4836bb;
  --😀😀😀: #654dff63;
  cursor: pointer;
  width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1em;
  font-weight: 800;
  letter-spacing: 2px;
  color: #fff;
  background: var(--😀);
  border: 2px solid var(--😀😀);
  border-radius: 0.75rem;
  box-shadow: 0 8px 0 var(--😀😀);
  transform: skew(-10deg);
  transition: all 0.1s ease;
  filter: drop-shadow(0 15px 20px var(--😀😀😀));
}

.start:active {
  letter-spacing: 0px;
  transform: skew(-10deg) translateY(8px);
  box-shadow: 0 0 0 var(--😀😀😀);
}
</style>
