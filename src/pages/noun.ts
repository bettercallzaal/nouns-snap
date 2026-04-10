import { shortenAddress } from '../utils.js';

const MAX_NOUN_ID = 1868;

export function buildNounPage(tokenId: number, owner: string, imageUrl: string, baseUrl: string) {
  const shortOwner = owner === 'Unknown' ? 'Unknown' : shortenAddress(owner);

  // Build dynamic nav children (only include prev/next when in range)
  const navChildren: string[] = [];
  if (tokenId > 0) navChildren.push('prev_btn');
  if (tokenId < MAX_NOUN_ID) navChildren.push('next_btn');

  // Build elements object — conditionally include nav buttons
  type ElementMap = Record<string, {
    type: string;
    props: Record<string, unknown>;
    children?: string[];
    on?: Record<string, unknown>;
  }>;

  const navElements: ElementMap = {};

  if (tokenId > 0) {
    navElements['prev_btn'] = {
      type: 'button' as const,
      props: { label: `#${tokenId - 1}`, icon: 'arrow-left' as const },
      on: {
        press: {
          action: 'submit' as const,
          params: { target: `${baseUrl}/noun?id=${tokenId - 1}` },
        },
      },
    };
  }

  if (tokenId < MAX_NOUN_ID) {
    navElements['next_btn'] = {
      type: 'button' as const,
      props: { label: `#${tokenId + 1}`, icon: 'arrow-right' as const },
      on: {
        press: {
          action: 'submit' as const,
          params: { target: `${baseUrl}/noun?id=${tokenId + 1}` },
        },
      },
    };
  }

  // Determine if owner has a valid address for etherscan link
  const hasValidOwner = owner !== 'Unknown' && owner.startsWith('0x');

  // Determine page children — only include btn_nav if there are nav buttons to show
  const ownerChildren: string[] = hasValidOwner
    ? ['image', 'info', 'owner_item', ...(navChildren.length > 0 ? ['btn_nav'] : []), 'btn_row']
    : ['image', 'info', 'owner_item', ...(navChildren.length > 0 ? ['btn_nav'] : []), 'btn_row'];
  const pageChildren = ownerChildren;

  return {
    version: '1.0' as const,
    theme: { accent: 'red' as const },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack' as const,
          props: { direction: 'vertical' as const, gap: 'md' as const },
          children: pageChildren,
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
        // Nav row (prev/next) — conditionally populated
        ...(navChildren.length > 0 ? {
          btn_nav: {
            type: 'stack' as const,
            props: { direction: 'horizontal' as const, gap: 'sm' as const },
            children: navChildren,
          },
        } : {}),
        // Spread nav button elements
        ...navElements,
        btn_row: {
          type: 'stack' as const,
          props: { direction: 'horizontal' as const, gap: 'sm' as const },
          children: [...(hasValidOwner ? ['view_owner_btn'] : []), 'share_btn', 'view_btn', 'back_btn'],
        },
        ...(hasValidOwner ? {
          view_owner_btn: {
            type: 'button' as const,
            props: { label: 'Owner', icon: 'external-link' as const },
            on: {
              press: {
                action: 'open_url' as const,
                params: { target: `https://etherscan.io/address/${owner}` },
              },
            },
          },
        } : {}),
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
