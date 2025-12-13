import React from 'react';
import ControlPanel from './ControlPanel';
import { CardState } from '../types';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    state: CardState;
    setState: React.Dispatch<React.SetStateAction<CardState>>;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, state, setState }) => {
    if (!isOpen) {
        // We keep the backdrop logic in component to support animation or exit? 
        // The original code rendered it conditionally but used CSS classes for animation.
        // To support exit animation, we need it mounted but invisible, or use AnimatePresence (not available here).
        // The original code checked `isMobile && (` then rendered fragments.
        // But the Backdrop had `onClick` and `opacity` transition.
        // The Sheet had `translate-y` transition.
        // So we should render it but control class.
        // But wait, if `!isMobile`, we don't render it at all in App.tsx.
        // `MobileDrawer` props says `isOpen`.
        // To mimic original behavior, we should probably return null if not open? 
        // No, the original code had:
        /* 
           isMobile && (
             <>
                <div className="backdrop..." />
                <div className="sheet..." />
             </>
           )
        */
        // AND inside that, it used `isMobileEditOpen` for opacity/translate.
        // So `isMobile` mounts it, `isOpen` (isMobileEditOpen) animates it.
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            {/* Sheet */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="编辑面板"
                className={`fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[2rem] z-50 transform transition-transform duration-300 cubic-bezier(0.32, 0.72, 0, 1) shadow-2xl flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Handle bar for visual cue */}
                <div className="w-full h-6 flex items-center justify-center pt-2" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
                <ControlPanel
                    state={state}
                    setState={setState}
                    isMobile={true}
                    onClose={onClose}
                />
            </div>
        </>
    );
};

export default MobileDrawer;
