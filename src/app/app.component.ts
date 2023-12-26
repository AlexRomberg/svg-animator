import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css"
})
export class AppComponent {
    title = "SVG-edit";
    svgContent: SafeHtml = "";

    constructor(private sanitizer: DomSanitizer) {}

    public onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (file) {
            this.readFile(file);
        }
    }

    private readFile(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            const svgContent = (e.target?.result as string) ?? "";
            this.displaySvg(svgContent);
        };
        reader.readAsText(file);
    }

    private displaySvg(content: string): void {
        const sanitizedContent: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(content);
        this.svgContent = sanitizedContent;
    }

    public getSvgLayers(svgContent: SafeHtml): { name: string; depth: number }[] {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent as string, "image/svg+xml");
        const layers: { name: string; depth: number }[] = [];

        function traverse(node: Node, depth: number): void {
            if (node.nodeType === Node.ELEMENT_NODE) {
                layers.push({ name: (node as Element).tagName, depth });
                const children = node.childNodes;
                for (let i = 0; i < children.length; i++) {
                    traverse(children[i], depth + 1);
                }
            }
        }

        traverse(doc.documentElement, 0);
        return layers;
    }
}
