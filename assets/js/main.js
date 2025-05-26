// MEGA MENU FUNCTION
document.querySelectorAll('[data-menu-trigger]').forEach(trigger => {
    const menuName = trigger.getAttribute('data-menu-trigger');
    const menuContent = document.querySelector(`[data-menu-content="${menuName}"]`);

    if (!menuContent) return;

    trigger.addEventListener('mouseenter', () => {
        document.querySelectorAll('.mega-menu-content').forEach(menu => {
            menu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
            menu.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
        });
        document.querySelectorAll('[data-menu-trigger]').forEach(t => {
            t.classList.remove('active');
        });

        menuContent.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        menuContent.classList.add('opacity-100', 'visible', 'pointer-events-auto');

        trigger.classList.add('active');
    });

    trigger.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!menuContent.matches(':hover') && !trigger.matches(':hover')) {
                menuContent.classList.add('opacity-0', 'invisible', 'pointer-events-none');
                menuContent.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
                trigger.classList.remove('active');
            }
        }, 200);
    });

    menuContent.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!menuContent.matches(':hover') && !trigger.matches(':hover')) {
                menuContent.classList.add('opacity-0', 'invisible', 'pointer-events-none');
                menuContent.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
                trigger.classList.remove('active');
            }
        }, 200);
    });
});


// MODAL FUNCTION
document.addEventListener("DOMContentLoaded", () => {

    const openButtons = document.querySelectorAll("[data-modal-toggle]");
    const closeButtons = document.querySelectorAll("[data-modal-close]");
    const modals = document.querySelectorAll("[id][tabindex]");

    function openModal(modal) {
        modal.classList.remove("hidden", "pointer-events-none", "opacity-0");
        setTimeout(() => {
            modal.classList.add("opacity-100");
            const content = modal.querySelector("[data-modal-content]");
            if (content) {
                content.classList.remove("scale-95", "opacity-0");
                content.classList.add("scale-100", "opacity-100");
            }
        }, 10);
    }

    function closeModal(modal) {
        modal.classList.remove("opacity-100");
        const content = modal.querySelector("[data-modal-content]");
        if (content) {
            content.classList.remove("scale-100", "opacity-100");
            content.classList.add("scale-95", "opacity-0");
        }
        setTimeout(() => {
            modal.classList.add("hidden", "pointer-events-none", "opacity-0");
        }, 300);
    }

    openButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-modal-toggle");
            const modal = document.getElementById(targetId);
            if (modal) openModal(modal);
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest("[id][tabindex]");
            if (modal) closeModal(modal);
        });
    });

    modals.forEach(modal => {
        const backdrop = modal.querySelector("[data-modal-backdrop-layer]");
        if (backdrop) {
            backdrop.addEventListener("click", () => {
                if (modal.getAttribute("data-modal-backdrop") !== "static") {
                    closeModal(modal);
                }
            });
        }
    });
});

// DRAWER
document.addEventListener("DOMContentLoaded", () => {
    // Toggle button
    document.querySelectorAll('[data-slot="offcanvas:toggle"]').forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const offcanvas = document.getElementById(targetId);
            const panel = offcanvas.querySelector('[data-slot="offcanvas:panel"]');

            offcanvas.classList.remove("hidden");
            requestAnimationFrame(() => {
                panel.classList.remove("-translate-x-full");
            });
        });
    });

    // Close triggers (close button and backdrop)
    document.querySelectorAll('[data-slot="offcanvas:close"], [data-slot="offcanvas:backdrop"]').forEach(closeEl => {
        closeEl.addEventListener("click", () => {
            const offcanvas = closeEl.closest('[data-slot="offcanvas:root"]');
            const panel = offcanvas.querySelector('[data-slot="offcanvas:panel"]');

            panel.classList.add("-translate-x-full");
            setTimeout(() => {
                offcanvas.classList.add("hidden");
            }, 300); // match transition duration
        });
    });
});

// MOBILE DROPDOWN
window.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('[data-slot="sidebar:item"]');

    // Function to update parent heights when children expand
    function updateParentHeights(element) {
        let parent = element.parentElement;
        while (parent) {
            const parentSidebarItem = parent.closest('[data-slot="sidebar:item"]');
            if (parentSidebarItem) {
                const parentContent = parentSidebarItem.querySelector('[data-slot="sidebar:content"]');
                if (parentContent && parentContent.classList.contains('expanded')) {
                    // Temporarily remove max-height to get natural height
                    const originalMaxHeight = parentContent.style.maxHeight;
                    parentContent.style.maxHeight = 'none';
                    const newHeight = parentContent.scrollHeight;
                    parentContent.style.maxHeight = originalMaxHeight;

                    // Set new height
                    parentContent.style.maxHeight = newHeight + 'px';
                }
                parent = parentSidebarItem.parentElement;
            } else {
                break;
            }
        }
    }

    sidebarItems.forEach(item => {
        const trigger = item.querySelector('[data-slot="sidebar:trigger"]');
        const content = item.querySelector('[data-slot="sidebar:content"]');
        const icon = trigger.querySelector('i');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            const isOpen = content.classList.contains('expanded');

            // Close siblings at the same level
            const parent = item.parentElement;
            const siblings = parent.children;

            Array.from(siblings).forEach(sibling => {
                if (sibling !== item && sibling.hasAttribute('data-slot')) {
                    const siblingContent = sibling.querySelector('[data-slot="sidebar:content"]');
                    const siblingIcon = sibling.querySelector('[data-slot="sidebar:trigger"] i');

                    if (siblingContent) {
                        siblingContent.classList.remove('expanded');
                        siblingContent.style.maxHeight = '0px';
                    }
                    if (siblingIcon) {
                        siblingIcon.classList.remove('ri-subtract-line');
                        siblingIcon.classList.add('ri-add-line');
                    }
                }
            });

            // Toggle current item
            if (!isOpen) {
                content.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon?.classList.remove('ri-add-line');
                icon?.classList.add('ri-subtract-line');

                // Update parent heights after a short delay to allow for transitions
                setTimeout(() => {
                    updateParentHeights(item);
                }, 50);
            } else {
                content.classList.remove('expanded');
                content.style.maxHeight = '0px';
                icon?.classList.remove('ri-subtract-line');
                icon?.classList.add('ri-add-line');

                // Update parent heights
                setTimeout(() => {
                    updateParentHeights(item);
                }, 50);
            }
        });
    });
});;