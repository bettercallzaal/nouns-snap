export function buildInputPage(baseUrl: string, totalSupply: number) {
  return {
    version: '1.0' as const,
    theme: { accent: 'red' as const },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack' as const,
          props: { direction: 'vertical' as const, gap: 'md' as const },
          children: ['title', 'desc', 'token_input', 'btn_row', 'btn_row_2'],
        },
        title: {
          type: 'text' as const,
          props: { content: 'Show Your Noun', weight: 'bold' as const },
        },
        desc: {
          type: 'text' as const,
          props: { content: `Enter a Noun ID (0-${totalSupply - 1}) to see its image and owner.`, size: 'sm' as const },
        },
        token_input: {
          type: 'input' as const,
          props: { name: 'tokenId', type: 'number' as const, label: 'Noun ID', placeholder: '42' },
        },
        btn_row: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: ['show_btn', 'random_btn'],
        },
        show_btn: {
          type: 'button' as const,
          props: { label: 'Show Noun', variant: 'primary' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/noun` },
            },
          },
        },
        random_btn: {
          type: 'button' as const,
          props: { label: 'Random Noun', icon: 'refresh-cw' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/random` },
            },
          },
        },
        btn_row_2: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: ['auction_btn', 'avatar_btn', 'zounz_btn'],
        },
        auction_btn: {
          type: 'button' as const,
          props: { label: 'Live Auction', icon: 'flame' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/auction` },
            },
          },
        },
        avatar_btn: {
          type: 'button' as const,
          props: { label: 'Avatar', icon: 'user' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/avatar-input` },
            },
          },
        },
        zounz_btn: {
          type: 'button' as const,
          props: { label: 'ZOUNZ DAO', icon: 'external-link' as const },
          on: {
            press: {
              action: 'open_url' as const,
              params: { target: 'https://nouns.build/dao/base/0xCB80Ef04DA68667c9a4450013BDD69269842c883' },
            },
          },
        },
      },
    },
  };
}
