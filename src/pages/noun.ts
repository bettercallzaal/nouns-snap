import { shortenAddress } from '../utils.js';

export function buildNounPage(tokenId: number, owner: string, imageUrl: string, baseUrl: string) {
  const shortOwner = owner === 'Unknown' ? 'Unknown' : shortenAddress(owner);

  return {
    version: '1.0' as const,
    theme: { accent: 'red' as const },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack' as const,
          props: { direction: 'vertical' as const, gap: 'md' as const },
          children: ['image', 'info', 'owner_item', 'btn_row'],
        },
        image: {
          type: 'image' as const,
          props: { url: imageUrl, aspect: '1:1' as const, alt: `Noun #${tokenId}` },
        },
        info: {
          type: 'item' as const,
          props: { title: `Noun #${tokenId}`, description: 'OG Nouns (nouns.wtf)' },
          children: ['noun_badge'],
        },
        noun_badge: {
          type: 'badge' as const,
          props: { label: 'Ethereum', color: 'blue' as const },
        },
        owner_item: {
          type: 'item' as const,
          props: { title: 'Owner', description: shortOwner },
        },
        btn_row: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: ['share_btn', 'view_btn', 'back_btn'],
        },
        share_btn: {
          type: 'button' as const,
          props: { label: 'Share', icon: 'share' as const },
          on: {
            press: {
              action: 'compose_cast' as const,
              params: {
                text: `I just looked up Noun #${tokenId} on Nouns Snap by @zaal`,
                embeds: [baseUrl, `https://noun.pics/${tokenId}`],
              },
            },
          },
        },
        view_btn: {
          type: 'button' as const,
          props: { label: 'nouns.wtf', variant: 'primary' as const, icon: 'external-link' as const },
          on: {
            press: {
              action: 'open_url' as const,
              params: { target: `https://nouns.wtf/noun/${tokenId}` },
            },
          },
        },
        back_btn: {
          type: 'button' as const,
          props: { label: 'Back', icon: 'arrow-left' as const },
          on: {
            press: {
              action: 'submit' as const,
              params: { target: `${baseUrl}/` },
            },
          },
        },
      },
    },
  };
}
