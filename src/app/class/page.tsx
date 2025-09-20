// src\app\class\page.tsx
'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'

export default function ClassPage() {
  return (
    <main className="p-4">
      <Dialog.Root>
        <Dialog.Trigger className="px-4 py-2 bg-blue-600 text-white rounded">
          Open Dialog
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow">
            <Dialog.Title className="text-lg font-bold">Class Info</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600">
              This is a small Radix UI dialog component.
            </Dialog.Description>

            <Dialog.Close asChild>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}
