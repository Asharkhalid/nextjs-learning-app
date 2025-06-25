"use client"
import {
     EditorContent, FloatingMenu, mergeAttributes,
     Node, useEditor,
   } from '@tiptap/react'
   import StarterKit from '@tiptap/starter-kit'
   import React, { useEffect } from 'react'
import Commands from './extensions/commands'
import suggestion from './extensions/suggestion'
   
//    const Foo = Node.create({
//      name: 'foo',
   
//      group: 'inline',
   
//      inline: true,
   
//      parseHTML() {
//        return [
//          {
//            tag: 'span',
//            getAttrs: node => node.hasAttribute('data-foo') && null,
//          },
//        ]
//      },
   
//      renderHTML({ HTMLAttributes }) {
//        return ['span', mergeAttributes({ 'data-foo': '', HTMLAttributes }), 'foo']
//      },
   
//      renderText() {
//        return 'foo'
//      },
   
//      addCommands() {
//        return {
//          insertFoo: () => ({ commands }) => {
//            return commands.insertContent({ type: this.name })
//          },
//        }
//      },
//    })
   
   export default () => {
     const editor = useEditor({
       extensions: [
         StarterKit,
         Commands.configure({
          suggestion,
        }),
     //     Foo,
       ],
       content: `
         <p>
           This is an example of a Medium-like editor. Enter a new line and some buttons will appear.
         </p>
         <p></p>
       `,
     })
   
     const [isEditable, setIsEditable] = React.useState(true)
   
     useEffect(() => {
       if (editor) {
         editor.setEditable(isEditable)
       }
     }, [isEditable, editor])
   
     return (
       <>
        
         {editor && <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
           <div data-testid="floating-menu" className="floating-menu">
             <button
               onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
               className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
             >
               H1
             </button>
             <button
               onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
               className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
             >
               H2
             </button>
             <button
               onClick={() => editor.chain().focus().toggleBulletList().run()}
               className={editor.isActive('bulletList') ? 'is-active' : ''}
             >
               Bullet list
             </button>
           </div>
         </FloatingMenu>}
         <EditorContent editor={editor} />
       </>
     )
   }