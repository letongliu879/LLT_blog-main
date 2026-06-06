'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'

const Comments = () => {
  const { theme, resolvedTheme } = useTheme()
  const commentsTheme = theme === 'dark' || resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className="wrapper" id="Comment">
      <Giscus
        repo="kkkano/allen_blog"
        repoId="R_kgDONxOD7A"
        category="General"
        categoryId="DIC_kwDONxOD7M4CmjqM"
        mapping="pathname" // 将评论映射到 pathname
        strict="0" // 不严格匹配路径
        reactionsEnabled="1" // 启用反应（点赞等）
        emitMetadata="0" // 不发送额外元数据
        inputPosition="bottom" // 输入框位置设置为底部
        theme={commentsTheme} // 动态设置主题
        lang="en" // 设置语言为英文
        loading="lazy" // 使用懒加载
      />
    </div>
  )
}

export default Comments
