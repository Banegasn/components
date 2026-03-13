import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, ViewChild } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import cssLanguage from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', cssLanguage);

@Component({
  selector: 'app-code-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.code-sample]': 'resolvedVariant() === "sample"',
    '[class.code-block]': 'resolvedVariant() === "block"'
  },
  template: `
    <pre><code class="hljs" [class]="languageClass()" [innerHTML]="highlightedHtml()"></code></pre>
    <div #source class="code-block-source" aria-hidden="true">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .hljs {
      border-radius: 8px;
    }

    .code-block-source {
      display: none;
    }
  `]
})
export class CodeBlockComponent implements AfterViewInit {
  readonly variant = input<'sample' | 'block' | ''>('');
  readonly language = input('');
  readonly code = input('');

  @ViewChild('source', { static: true })
  private sourceRef!: ElementRef<HTMLElement>;

  private readonly projectedSource = signal('');
  private readonly initialMarkup: string;
  private readonly legacyLanguage: string;

  readonly resolvedVariant = computed<'sample' | 'block'>(() => {
    if (this.variant() === 'block' || this.hostRef.nativeElement.classList.contains('code-block')) {
      return 'block';
    }

    return 'sample';
  });

  readonly resolvedLanguage = computed<'xml' | 'typescript' | 'javascript' | 'css' | 'plaintext'>(() => {
    const explicitLanguage = (this.language().trim().toLowerCase() || this.legacyLanguage).trim().toLowerCase();

    switch (explicitLanguage) {
      case 'html':
      case 'xml':
        return 'xml';
      case 'ts':
      case 'typescript':
        return 'typescript';
      case 'js':
      case 'javascript':
        return 'javascript';
      case 'css':
        return 'css';
      default:
        return this.detectCodeLanguage(this.readSource());
    }
  });

  readonly formattedSource = computed(() => this.formatCode(this.readSource(), this.resolvedLanguage()));

  readonly languageClass = computed(() => this.resolvedLanguage() === 'plaintext'
    ? 'hljs'
    : `hljs language-${this.resolvedLanguage() === 'xml' ? 'html' : this.resolvedLanguage()}`);

  readonly highlightedHtml = computed(() => this.resolvedLanguage() === 'plaintext'
    ? this.escapeHtml(this.formattedSource())
    : hljs.highlight(this.formattedSource(), { language: this.resolvedLanguage() }).value);

  constructor(private readonly hostRef: ElementRef<HTMLElement>) {
    this.initialMarkup = this.hostRef.nativeElement.innerHTML;
    this.legacyLanguage = this.getLegacyLanguage();
  }

  ngAfterViewInit() {
    this.projectedSource.set(this.sourceRef.nativeElement.textContent?.replace(/\r\n?/g, '\n').trim() ?? '');
  }

  private readSource() {
    const explicitCode = this.code().replace(/\r\n?/g, '\n').trim();

    if (explicitCode) {
      return explicitCode;
    }

    const source = this.projectedSource();

    if (source) {
      return source;
    }

    if (!this.initialMarkup) {
      return '';
    }

    const parserHost = this.hostRef.nativeElement.ownerDocument.createElement('div');
    parserHost.innerHTML = this.initialMarkup;
    return parserHost.textContent?.replace(/\r\n?/g, '\n').trim() ?? '';
  }

  private getLegacyLanguage() {
    if (!this.initialMarkup) {
      return '';
    }

    const parserHost = this.hostRef.nativeElement.ownerDocument.createElement('div');
    parserHost.innerHTML = this.initialMarkup;
    const codeElement = parserHost.querySelector<HTMLElement>('code');

    const languageClass = Array.from(codeElement?.classList ?? []).find((className) => className.startsWith('language-'));
    return languageClass?.replace('language-', '') ?? '';
  }

  private formatCode(source: string, language: 'xml' | 'typescript' | 'javascript' | 'css' | 'plaintext') {
    if (language === 'xml') {
      return this.formatMarkup(source);
    }

    return source;
  }

  private formatMarkup(source: string) {
    const normalized = source
      .replace(/>\s+</g, '>\n<')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const lines = normalized
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let indentLevel = 0;

    return lines.map((line) => {
      if (this.isClosingTag(line)) {
        indentLevel = Math.max(indentLevel - 1, 0);
      }

      const formattedLine = `${'  '.repeat(indentLevel)}${line}`;

      if (this.isOpeningTag(line)) {
        indentLevel += 1;
      }

      return formattedLine;
    }).join('\n');
  }

  private isOpeningTag(line: string) {
    return /^<([a-z][^\s/>]*)(?:(?!\/>)[^<>])*?>$/i.test(line)
      && !/^<\//.test(line)
      && !/^<!/.test(line)
      && !/^<.*<\/.*>$/.test(line);
  }

  private isClosingTag(line: string) {
    return /^<\//.test(line);
  }

  private detectCodeLanguage(source: string): 'xml' | 'typescript' | 'javascript' | 'css' | 'plaintext' {
    const trimmed = source.trim();

    if (/^\s*[.#@a-z-]+\s*\{/m.test(trimmed) || /:\s*[^;]+;/m.test(trimmed)) {
      return 'css';
    }

    if (/\b(import|export|interface|type|const|let|function|class)\b/.test(trimmed) || /@Component\s*\(/.test(trimmed)) {
      return 'typescript';
    }

    if (/\b(function|const|let|var)\b/.test(trimmed)) {
      return 'javascript';
    }

    if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) {
      return 'xml';
    }

    return 'plaintext';
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
