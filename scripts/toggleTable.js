import { createElement } from './domUtils.js';

export class TableToggler {
    constructor() {
        this.headers = [];
    }

    async initialize() {
        try {
            this.headers = document.querySelectorAll('h2.toggle-header');
            this.addEventListeners();
        } catch (error) {
            console.error('Failed to initialize TableToggler:', error);
        }
    }

    addEventListeners() {
        for (const header of this.headers) {
            header.addEventListener('click', (event) => this.handleHeaderClick(event));
        }
    }

    async handleHeaderClick(event) {
        try {
            const header = event.currentTarget;
            const table = header.nextElementSibling;
            if (table && table.tagName.toLowerCase() === 'table') {
                await this.toggleTable(table);
            }
        } catch (error) {
            console.error('Failed to handle header click:', error);
        }
    }

    async toggleTable(table) {
        const isVisible = table.style.display !== 'none';
        table.style.display = isVisible ? 'none' : 'table';
        await this.yieldToEventLoop();
    }

    async yieldToEventLoop() {
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}

export async function initializeToggleTable() {
    const tableToggler = new TableToggler();
    await tableToggler.initialize();
}
