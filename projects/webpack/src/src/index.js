// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

console.log('log')

import alias from '@/alias'
import './version'
import bird from './images/bird.png'
import svg from './images/TablerAntennaBars5.svg'
import './index.css'
import './index.less'
import lessStyles from './index.module.less'
import ts from './index.ts'
import { createApp } from 'vue'
import VueComponent from './component.vue'
import ReactComponent from './component.jsx'
import React from 'react'
import { createRoot } from 'react-dom/client'
import files from '~files'
import md, { frontmatter } from './hello.md'

fetch(`/postman/get?text=hello%20proxy`).then(async response => {
  const json = await response.json()
  const fetchNode = document.createElement('div')
  document.body.appendChild(fetchNode)
  fetchNode.textContent = json.args.text
})

fetch(`/mock-api/ping`).then(async response => {
  const json = await response.json()
  const mockGetNode = document.createElement('div')
  document.body.appendChild(mockGetNode)
  mockGetNode.textContent = `hello ${json.data}`
})

const helloNode = document.createElement('div')
helloNode.textContent = 'hello world'
document.body.appendChild(helloNode)

const obj = {}
const optionalChainingNode = document.createElement('div')
optionalChainingNode.textContent = obj?.field || 'fallback'
document.body.appendChild(optionalChainingNode)

const aliasNode = document.createElement('div')
aliasNode.textContent = alias
document.body.appendChild(aliasNode)

const birdImg = document.createElement('img')
birdImg.id = 'bird'
birdImg.src = bird
document.body.appendChild(birdImg)

const svgImg = document.createElement('img') 
svgImg.id = 'svg'
svgImg.src = svg
document.body.appendChild(svgImg)

const cssNode = document.createElement('div')
cssNode.className = 'css'
cssNode.textContent = 'hello css'
document.body.appendChild(cssNode)

const lessNode = document.createElement('div')
lessNode.className = 'less'
lessNode.textContent = 'hello less'
document.body.appendChild(lessNode)

const lessModulesNode = document.createElement('div')
lessModulesNode.className = lessStyles.lessModules
lessModulesNode.textContent = 'hello less modules'
document.body.appendChild(lessModulesNode)

const tsNode = document.createElement('div')
tsNode.textContent = ts()
document.body.appendChild(tsNode)

const vueRoot = document.createElement('div')
document.body.appendChild(vueRoot)
createApp(VueComponent).mount(vueRoot)

const reactRoot = document.createElement('div')
document.body.appendChild(reactRoot)
createRoot(reactRoot).render(React.createElement(ReactComponent))

// Create a div element to display file content
const filesDiv = document.createElement('div')
filesDiv.textContent = JSON.stringify(files, null, 0)
document.body.appendChild(filesDiv)

// Display markdown content
const mdDiv = document.createElement('div')
mdDiv.innerHTML = md
document.body.appendChild(mdDiv)

// New: Display frontmatter author information
const authorDiv = document.createElement('div')
authorDiv.textContent = `Author: ${frontmatter.author}`
document.body.appendChild(authorDiv)