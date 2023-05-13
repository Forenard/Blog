---
title: Works
date: 2023-05-13
tags: 
  - Other
---

---

<template>
    <div class='works-block'>
        <h2>POOL</h2>
        <p class='works-date'>2021/10/30</p>
        <video src="./works/pool0.mp4" controls></video>
        <div class='works-discription'>
            <a href="https://sessions.frontl1ne.net/"> SESSIONS in C4 LAN 2023 SPRING</a> : GLSL Graphics Compoの優勝作品です<br>
            57409文字の生のGLSLコードのみで書かれています<br>
            完全版は<a href="https://www.youtube.com/watch?v=xTWGxKEn7jw">こちら</a>からご覧いただけます
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        tryRemoveDisqus();
    },
};
function tryRemoveDisqus() {
  const elem = document.getElementById('disqus_thread');
  if (elem) {
    elem.style.display = 'none';
  }
  else
  {
    setTimeout(tryRemoveDisqus, 1000/60);
  }
}
</script>

<style lang="stylus">
.works-block
{
    padding: 1rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    video
    {
        width: 100%;
        height: auto;
    }
}
.works-date
{
    margin-top: 2rem;
    margin-bottom: 2rem;
    color: rgba(255,255,255, 0.5);
    font-style: italic;
}
.works-discription
{
    margin-top: 2rem;
    margin-bottom: 2rem;
}
</style>
