// extensions/suggestion.js
import { Editor, ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import CommandsList from '../components/CommandsList'
import 'tippy.js/dist/tippy.css'

const suggestion = {
  items: ({ query }: { query: string }) => {
    return [
     {
          title: "Heading 1",
          command: ({editor, range}: {editor: Editor; range: any}) => {
               editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run()

          },
          description: "Big section heading",
        },
        {
          title: "Heading 2",
          command: ({editor, range}: {editor: Editor; range: Range}) => {
            editor.chain().focus().setHeading({level: 2}).run();
          },
          description: "Medium section heading",
        },
      {
        title: 'Bold',
        command: ({ editor, range }: { editor: any, range: any }) => {
          editor.chain().focus().deleteRange(range).setMark('bold').run()
        },
      },
      {
        title: 'Italic',
        command: ({ editor, range }: { editor: any, range: any }) => {
          editor.chain().focus().deleteRange(range).setMark('italic').run()
        },
      },
    ]
      .filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 10)
  },

  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: { editor: any; clientRect: any }) => {
        component = new ReactRenderer(CommandsList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate: (props: { editor: any; clientRect: any }) => {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit: () => {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}

export default suggestion
