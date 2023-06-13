---
title: Works
date: 2023-05-13
tags: 
  - Other
---

---

<template>
    <div class='works-block'>
        <a href="https://youtu.be/iVjLUrviE9I"><h2>VJ at lambda</h2></a>
        <p class='works-date'>2023/06/10</p>
        <iframe width="690" height="388" src="https://www.youtube.com/embed/iVjLUrviE9I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <div class='works-discription'>
            <p>GLSLで行ったVJ</p>
            <a href="https://twitter.com/ymgmcmc/status/1666401630651293696?s=20">lambda</a>にて行った初めてのVJです<br>
            10万文字のGLSLで書き、<a href="https://github.com/slerpyyy/sh4der-jockey">sh4der-jockey</a>でVJしました<br>
            ソースコードは<a href="https://github.com/Forenard/VJ-at-lambda-2023-06-10">こちらです</a>
        </div>
    </div>
    <div class='works-block'>
        <a href="https://renard-vrc.booth.pm/items/4755457"><h2>AvatarMotionRecorder</h2></a>
        <p class='works-date'>2023/05/07</p>
        <img src="./works/AvatarMotionRecorder.png"/>
        <div class='works-discription'>
            <p>VRChatのアバターの動きを記録/再生する</p>
            メッシュの頂点情報をテクスチャに保存/再構築する仕組みを考え、アバターの動きを完全に記録するギミックを作りました
        </div>
    </div>
    <div class='works-block'>
        <a href="https://www.youtube.com/watch?v=xTWGxKEn7jw"><h2>POOL</h2></a>
        <p class='works-date'>2023/04/29</p>
        <video src="./works/pool.mp4" poster="./works/pool.png" controls></video>
        <div class='works-discription'>
            <p><a href="https://sessions.frontl1ne.net/"> SESSIONS in C4 LAN 2023 SPRING</a> GLSL Graphics Compoの優勝作品</p>
            57409文字の生のGLSLコードのみで書かれています
        </div>
    </div>
    <div class='works-block'>
        <a href="https://vrchat.com/home/world/wrld_a985009f-95c6-46a0-b6a7-417a24fd366b"><h2>Star Trails</h2></a>
        <p class='works-date'>2023/02/12</p>
        <video src="./works/star-trails.mp4" poster="./works/star-trails.jpg" controls></video>
        <div class='works-discription'>
            <p>比較明合成で星空の撮影ができるVRChatのワールド</p>
            比較明合成で撮影ができるカメラを実装し、星空の軌跡を撮影できるようにしました
        </div>
    </div>
    <div class='works-block'>
        <a href="https://vrchat.com/home/world/wrld_5b27617a-89d3-475f-b35e-7e2fb36325f6"><h2>Lenia Room</h2></a>
        <p class='works-date'>2022/12/29</p>
        <video src="./works/lenia.mp4" poster="./works/lenia.jpg" controls></video>
        <div class='works-discription'>
            <p>インタラクティブなLeniaシミュレーションを体験できるVRChatのワールド</p>
            <a href="https://chakazul.github.io/lenia.html">Lenia</a>という連続セルオートマトンをVRChatのワールドとして実装しました。<br>
            手で触れることで生物の振る舞いに干渉して遊ぶことができます。
        </div>
    </div>
    <div class='works-block'>
        <h2><a href="https://forenard.github.io/Virus">Virus Fighter</a></h2>
        <p class='works-date'>2022/10/09</p>
        <video src="./works/virus.mp4" poster="./works/virus.png" controls></video>
        <div class='works-discription'>
            <p>ウイルスを送り付け合う対戦型オンラインゲーム</p>
            Unityを用いて作成したオンラインゲームです<br>
            Windows95をイメージしたUIや、それっぽいウイルスの挙動などにこだわりました<br>
            (Chrome推奨)
        </div>
    </div>
    <div class='works-block'>
        <h2><a href="https://unityroom.com/games/paralelworldcollecter">ParallelWorldCollector</a></h2>
        <p class='works-date'>2022/05/08</p>
        <img src="./works/ParallelWorldCollector.png"/>
        <div class='works-discription'>
            <p>平行世界を行き来してモンスターから逃げるダンジョンゲーム</p>
            Unity1Week「そろえる」の参加作品です<br>
            部内の先輩二人と共同製作しました<br>
            敵のいない平行世界に逃げるというコンセプトが面白いと思います
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
    p
    {
        font-weight: bold;
    }
}
</style>
