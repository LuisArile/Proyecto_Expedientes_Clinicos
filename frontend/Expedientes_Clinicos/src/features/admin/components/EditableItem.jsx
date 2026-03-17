import React, { useState } from "react";
import { Edit2, Check, X } from "lucide-react";

export function EditableItem({ id, nombre, onUpdate, onDelete, onSelect, isSelected,  icon: Icon, isTag = false }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(nombre);

    const handleSave = (e) => {
        e.stopPropagation();
        if (editValue.trim() !== "") {
            onUpdate(id, editValue);
            setIsEditing(false);
        }
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setEditValue(nombre);
        setIsEditing(false);
    };

    const containerBase = isTag 
        ? "flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm hover:border-purple-200 group transition-all"
        : `group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
            isSelected ? "bg-blue-50 border-blue-300 shadow-sm" : "bg-white border-gray-100 hover:border-blue-200"
        }`;

    return (
        <div className={containerBase} onClick={() => !isEditing && onSelect?.()}>
            {isEditing ? (
                <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                    <input 
                        autoFocus className={`flex-1 bg-transparent text-sm outline-none border-b border-blue-400 ${isTag ? 'w-24' : ''}`}
                        value={editValue} onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave(e)}
                        onBlur={handleCancel}
                    />
                    <button onClick={handleSave} className="text-green-600 hover:scale-110 transition-transform"> <Check className="size-4"/> </button>
                    <button onClick={handleCancel} className="text-gray-400 hover:scale-110 transition-transform"> <X className="size-4"/> </button>
                </div>
            ) : (
            <>
            <div className="flex items-center gap-3 truncate">
                {!isTag && Icon && (
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}> <Icon className="size-4" /> </div>
                )}
                <span className={`${isTag ? 'text-xs' : 'text-sm font-bold'} text-gray-800 truncate uppercase`}> {nombre} </span>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Editar"
                    >
                    <Edit2 className="size-3.5" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(id); }} 
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Eliminar"
                    >
                    <X className="size-3.5" />
                </button>
            </div>
            </>
        )}
        </div>
    );
}