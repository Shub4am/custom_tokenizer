export interface TokenizerConfig {
  vocab_size: number;
  special_tokens: {
    pad_token: string;
    unk_token: string;
    bos_token: string;
    eos_token: string;
  };
}

export interface Vocab {
  [token: string]: number;
}

export interface TokenizerOutput {
  ids: number[];
  tokens: string[];
}