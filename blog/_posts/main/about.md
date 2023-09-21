---
title: About
date: 2023-05-13
tags: 
  - Other
---

---

## Profile

<template>
<div class="profile">
  <img src="./about/Renard_icon.png"></src>
  <div>
    <div class="profile-head">
      <p><b>Renard/レナード/ルナール</b></p>
    </div>
    <div class="profile-body">
      <p>Graphics Programmer<br>Game Programmer</p>
      <p>面白い表現が好き</p>
    </div>
  </div>
</div>
</template>

## Contact

- [Twitter (main)](https://twitter.com/Renardealer) : メインアカウント
- [Twitter (sub)](https://twitter.com/Renard_VRC) : VRChat用アカウント
- [はてなブログ](https://renard.hateblo.jp/)：技術ブログです
- [GitHub](https://github.com/Forenard) : ライブラリや様々なソースコードを公開しています
- [Qiita](https://qiita.com/Renard_Renard) : 技術記事を投稿しています

## Interest

- シェーダー開発
- VR上での表現
- ゲーム開発
- VJ

## Skill

- GLSL
- HLSL
- ShaderLab
- C#
- C++
- UdonSharp

## Affiliation

- 東京工業大学 工学院 情報通信系 : 学士課程 (2020/4-)

## Activities

- [SESSIONS in C4 LAN 2023 SPRING](https://sessions.frontl1ne.net/) : GLSL Graphics Compo
  - [優勝](https://twitter.com/SESSIONS_Party/status/1652513515767488512)
  - [作品](https://www.youtube.com/watch?v=xTWGxKEn7jw)

- Silicon Studio Hackathon 2022『シェーダーで“非日常”を創り出そう』
  - 優勝

- CAPCOM Hackathon 2022
  - 優勝
  - [作品](https://forenard.github.io/ColumbusOfReiwa/) (chrome推奨)

- Unity Engine Challenge by mixi GROUP #3 (2022)
  - 準優勝

## Internship

- Silicon Studio : (2023/4-2023/8)

## Others

- [SESSIONSクリエイターインタビュー](https://youtu.be/TDD5gfUi5-o?si=G_oe8_mrxgVUOuBJ)
- [C102 シェーダーを紹介する合同誌を頒布](https://twitter.com/Renard_VRC/status/1686357375476019200?s=20)
- [normalizeFM 44. 出演](https://twitter.com/h_doxas/status/1672162000758259712?s=20)
- [つぶやきGLSLとは (PWA Night vol.44の発表資料)](https://www.slideshare.net/GearsRenard/glslpptx-253677717)
- [【VRChat】自分のアバターにゲームを仕込んで暇潰ししよう](https://trap.jp/post/1743/)


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
.profile
{
  display: flex;
  align-items: center;
  img
  {
    width: 30%;
    height: 30%;
  }
  img,div
  {
    margin-top: 25px;
    margin-bottom: 25px;
    margin-left: auto;
    margin-right: auto;
  }
  .profile-head
  {
    font-size: 20px;
  }
}
</style>
