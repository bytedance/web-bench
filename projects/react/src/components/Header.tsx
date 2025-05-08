import React, { useCallback } from 'react'
import { useBlogContext } from '../context/BlogContext'
import Tooltip from './Tooltip'

interface HeaderProps {
  onAddBlog: () => void
  onFastComment: () => void
  navigate: (path: string) => void
}

const generateRandomBlogs = (count: number) => {
  const blogs = []
  for (let i = 0; i < count; i++) {
    const randomDigits = Math.floor(Math.random() * 900000000000) + 100000000000
    blogs.push({
      title: `RandomBlog-${randomDigits}`,
      detail: `This is Random content ${randomDigits} content`,
    })
  }
  return blogs
}

const Header: React.FC<HeaderProps> = ({ onAddBlog, onFastComment, navigate }) => {
  const { blogs, setBlogs } = useBlogContext()

  const handleAppendRandomBlogs = useCallback(() => {
    const randomBlogs = generateRandomBlogs(100000)
    setBlogs((prevBlogs) => [...prevBlogs, ...randomBlogs])
  }, [setBlogs])

  return (
    <header>
      <h1>
        Hello Blog
        <span className="blog-list-len">({blogs.length})</span>{' '}
      </h1>
      <div className="header-buttons">
        <Tooltip text="Write a New Blog For everyone">
          <button onClick={onAddBlog}>Add Blog</button>
        </Tooltip>
        <button onClick={handleAppendRandomBlogs}>Random Blogs</button>
        <button onClick={onFastComment}>Fast Comment</button>
        <button onClick={() => navigate('/game')}>🎮</button>
      </div>
    </header>
  )
}

export default Header