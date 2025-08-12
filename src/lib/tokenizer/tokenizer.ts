import { TokenizerConfig, Vocab, TokenizerOutput } from './types';

export class Tokenizer {
  private vocab: Vocab;
  private inverse_vocab: Map<number, string>;
  private config: TokenizerConfig;

  constructor(config: TokenizerConfig) {
    this.config = config;
    this.vocab = {};
    this.inverse_vocab = new Map();

    const savedVocab = typeof window !== 'undefined' ? localStorage.getItem('tokenizer_vocab') : null;
    if (savedVocab) {
      this.vocab = JSON.parse(savedVocab);
      this.inverse_vocab = new Map(Object.entries(this.vocab).map(([tok, id]) => [id, tok]));
    } else {
      this.addSpecialTokens();
    }
  }

  private addSpecialTokens() {
    const { special_tokens } = this.config;
    Object.values(special_tokens).forEach((token, idx) => {
      this.vocab[token] = idx;
      this.inverse_vocab.set(idx, token);
    });
    this.saveVocab();
  }

  private saveVocab() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tokenizer_vocab', JSON.stringify(this.vocab));
    }
  }

  public train(texts: string[]): void {
    const tokens = new Set<string>();
    texts.forEach(text => {
      text.split(/\s+/).forEach(token => {
        if (token.trim()) tokens.add(token);
      });
    });

    let idx = Object.keys(this.vocab).length;
    tokens.forEach(token => {
      if (!Object.prototype.hasOwnProperty.call(this.vocab, token)) {
        this.vocab[token] = idx;
        this.inverse_vocab.set(idx, token);
        idx++;
      }
    });

    this.saveVocab();
  }

  public encode(text: string): TokenizerOutput {
    const tokens = text.split(/\s+/).filter(Boolean);
    const ids = tokens.map(token =>
      this.vocab[token] ?? this.vocab[this.config.special_tokens.unk_token]
    );
    return { ids, tokens };
  }

  public decode(ids: number[]): string {
    return ids
      .map(id => this.inverse_vocab.get(id) ?? this.config.special_tokens.unk_token)
      .join(' ');
  }
}
