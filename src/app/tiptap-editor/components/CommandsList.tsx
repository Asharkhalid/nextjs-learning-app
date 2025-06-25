// components/CommandsList.tsx
import React, {
     useState,
     useImperativeHandle,
     forwardRef,
     KeyboardEvent,
   } from 'react'
   
   export interface CommandItem {
     title: string
     command: (props: { editor: any; range: any }) => void
   }
   
   export interface CommandsListProps {
     items: CommandItem[]
     command: (item: CommandItem) => void
   }
   
   export interface CommandsListHandle {
     onKeyDown: (props: { event: KeyboardEvent }) => boolean
   }
   
   const CommandsList = forwardRef<CommandsListHandle, CommandsListProps>(
     ({ items, command }, ref) => {
       const [selectedIndex, setSelectedIndex] = useState(0)
   
       const onKeyDown = ({ event }: { event: KeyboardEvent }): boolean => {
         if (event.key === 'ArrowUp') {
           event.preventDefault()
           setSelectedIndex(
             (prev) => (prev + items.length - 1) % items.length
           )
           return true
         }
         if (event.key === 'ArrowDown') {
           event.preventDefault()
           setSelectedIndex(
             (prev) => (prev + 1) % items.length
           )
           return true
         }
         if (event.key === 'Enter') {
           event.preventDefault()
           selectItem(selectedIndex)
           return true
         }
         return false
       }
   
       const selectItem = (index: number) => {
         const item = items[index]
         if (item) {
           command(item)
         }
       }
   
       // Expose onKeyDown method to the parent via ref.
       useImperativeHandle(ref, () => ({
         onKeyDown,
       }))
   
       return (
         <div className="dropdown-menu">
           {items.length > 0 ? (
             items.map((item, index) => (
               <button
                 key={index}
                 className={index === selectedIndex ? 'is-selected' : ''}
                 onClick={() => selectItem(index)}
               >
                 {item.title}
               </button>
             ))
           ) : (
             <div className="item">No result</div>
           )}
   
           <style jsx>{`
             .dropdown-menu {
               // background: white;
               // border: 1px solid #ccc;
               border-radius: 0.7rem;
               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
               display: flex;
               flex-direction: row;
               gap: 0.1rem;
               overflow: auto;
               padding: 0.4rem;
               position: relative;
             }
             button {
               align-items: center;
               background-color: transparent;
               border: none;
               display: flex;
               gap: 0.25rem;
               padding: 0.4rem;
               text-align: left;
               width: 100%;
             }
             button:hover,
             button.is-selected {
               background-color: #ddd;
             }
           `}</style>
         </div>
       )
     }
   )
   
   CommandsList.displayName = 'CommandsList'
   export default CommandsList
   