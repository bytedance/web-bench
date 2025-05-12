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

'use client'

import { useRouter } from 'next/navigation'

export default function RemoveFromWishlistButton({ productId }: { productId: string }) {
  const router = useRouter()

  const handleRemove = async () => {
    const response = await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <button className="remove-from-wishlist" onClick={handleRemove}>
      Remove
    </button>
  )
}