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

import React from 'react'

function Search({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search Blogs"
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: '200px',
        boxSizing: 'border-box',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '10px',
        fontSize: '14px'
      }}
    />
  )
}

export default React.memo(Search)