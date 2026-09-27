import { EducationLesson } from '../types';

export const LESSONS_DATA: EducationLesson[] = [
  {
    id: 'lesson-1',
    slug: 'what-is-on-chain-data',
    title: 'What is On-Chain Data?',
    subtitle: 'Looking past market noise into the transparent digital ledger',
    estimatedMinutes: 4,
    coreQuestion: 'Why does Bitcoin have transparent economic data that stock markets can only dream of?',
    simpleTakeaway: 'Every Bitcoin transaction since 2009 is recorded on a publicly verifiable ledger. This lets us observe investor behavior, cost bases, and coin age without relying on Wall Street estimates.',
    interactiveModel: 'realized_price',
    sections: [
      {
        title: 'The Transparent Ledger',
        text: 'Traditional finance operates behind closed doors. You cannot see when Berkshire Hathaway quietly sells stock until quarterly filings months later. With Bitcoin, every time coins move between wallets, the blockchain records the exact amount, timestamp, and destination.',
        analogy: 'Imagine a glass vault in the center of the world where you cannot see people’s names, but you can see every bar of gold being placed inside or carried out in real-time.'
      },
      {
        title: 'UTXO: Unspent Transaction Outputs',
        text: 'Bitcoin does not use traditional accounts like a bank balance. It works like paper bills and coins called UTXOs. When you receive 0.5 BTC, that specific chunk has a "birth date" (the block it was minted or sent to you). When you later spend it, analysts can see how long it was held and what the market price was when you originally received it.',
        callout: 'This age and cost-tracking capability is the foundation of modern on-chain intelligence.'
      }
    ],
    quiz: {
      question: 'What makes Bitcoin on-chain analysis uniquely possible compared to traditional stock markets?',
      options: [
        'Bitcoin is backed by central banks that publish weekly audits',
        'Every coin transaction and its holding duration is publicly verifiable on the blockchain',
        'Wall Street firms report their Bitcoin trades instantly via regulatory forms',
        'Mining pools vote on which wallets are allowed to sell each day'
      ],
      correctIndex: 1,
      explanation: 'Bitcoin’s decentralized blockchain records every transaction, coin age, and settlement publicly, giving all analysts equal access to raw data.'
    }
  },
  {
    id: 'lesson-2',
    slug: 'market-cap-vs-realized-cap',
    title: 'Market Cap vs Realized Cap',
    subtitle: 'Why the conventional valuation formula is fundamentally deceptive',
    estimatedMinutes: 5,
    coreQuestion: 'How much actual capital has flowed into Bitcoin?',
    simpleTakeaway: 'Market Cap assumes every coin is worth today’s price. Realized Cap calculates what investors actually paid when they bought their coins, providing Bitcoin’s true aggregate cost basis.',
    interactiveModel: 'realized_price',
    sections: [
      {
        title: 'The Flaw in Market Capitalization',
        text: 'Market Cap is simply: Current Price × 19.8 Million Coins. If the last Bitcoin traded for $100,000, Market Cap assumes all 19.8 million coins are worth $100,000—even coins lost by Satoshi Nakamoto in 2010 that haven’t moved in 15 years!',
        analogy: 'If 1 house in a 1,000-home subdivision sells for $1,000,000, does that mean $1 Billion of real cash was deposited into that neighborhood? No! Many owners bought for $150,000 years ago.'
      },
      {
        title: 'Realized Cap: The True Cost Basis',
        text: 'Invented by CoinMetrics in 2018, Realized Cap values each UTXO at the market price on the specific day it last moved. If a coin was last moved in 2017 when price was $4,000, Realized Cap counts that coin as $4,000, not today’s price. Summing this across all coins reveals the aggregate dollar capital stored inside the network.',
        callout: 'Dividing Realized Cap by total supply gives the Realized Price—the collective breakeven level for the entire network.'
      }
    ],
    quiz: {
      question: 'If a Bitcoin was last transferred in 2020 at $10,000, how does Realized Cap value that coin today?',
      options: [
        'At today’s current market price',
        'At $0 because it hasn’t moved recently',
        'At $10,000 (the price when it last moved)',
        'At the average mining production cost'
      ],
      correctIndex: 2,
      explanation: 'Realized Cap specifically values each coin output at the exact price when it was last transacted on-chain, reflecting historical capital committed.'
    }
  },
  {
    id: 'lesson-3',
    slug: 'what-is-mvrv',
    title: 'Understanding MVRV Ratio',
    subtitle: 'The ultimate macro valuation compass',
    estimatedMinutes: 6,
    coreQuestion: 'Is Bitcoin currently cheap, fair, or dangerously overheated?',
    simpleTakeaway: 'MVRV compares the market price to the aggregate purchase price of all holders. Values below 1.0 indicate historic bargains; values above 3.5 signal late-stage bull market euphoria.',
    interactiveModel: 'mvrv',
    sections: [
      {
        title: 'The Ratio of Market to Reality',
        text: 'MVRV stands for Market Value to Realized Value. It is simply Market Cap divided by Realized Cap. When MVRV is 2.0, the current market price is double what the average coin holder paid.',
        analogy: 'Imagine an equity portfolio where the current paper balance is $200,000 and total cash contributed was $100,000. MVRV is 2.0. If paper balance balloons to $500,000 without new cash deposits (MVRV 5.0), the urge to take profit becomes overwhelming.'
      },
      {
        title: 'Historical MVRV Zones',
        text: 'Historically, MVRV has provided exceptional cyclical boundaries: Under 1.0 marks generational bear market bottoms where holders are underwater in aggregate. Above 3.7 marks euphoric cycle blow-offs where virtually everyone is in massive paper profit and smart money distributes.',
        callout: 'MVRV filters out speculative hype by grounding market price against actual on-chain capital commitment.'
      }
    ],
    quiz: {
      question: 'What historically occurred when Bitcoin’s MVRV ratio fell below 1.0?',
      options: [
        'The network halted and miners went bankrupt permanently',
        'Coins traded at a discount to average acquisition cost, marking generational bottoms',
        'Massive inflation forced the network difficulty to double',
        'Governments banned Bitcoin transactions'
      ],
      correctIndex: 1,
      explanation: 'When MVRV drops below 1.0, the current market price is lower than what holders paid on average, which historically coincided with major multi-year macro bottoms (2015, 2018, 2020, 2022).'
    }
  },
  {
    id: 'lesson-4',
    slug: 'long-term-vs-short-term-holders',
    title: 'Long-Term vs Short-Term Holders',
    subtitle: 'The 155-day statistical line in the sand',
    estimatedMinutes: 5,
    coreQuestion: 'How can on-chain analysts separate diamond hands from speculative day traders?',
    simpleTakeaway: 'Coins held longer than 155 days statistically rarely move. Tracking the balance between Long-Term Holders and Short-Term Holders reveals whether coins are accumulating or being distributed.',
    interactiveModel: 'hodl_waves',
    sections: [
      {
        title: 'The 155-Day Threshold',
        text: 'Empirical research across 15+ years of Bitcoin history shows that once a coin has sat untouched in a wallet for 155 days (roughly 5 months), the probability that it will be spent on any given day drops below 1%. These entities are classified as Long-Term Holders (LTH).',
        analogy: 'Think of 155 days as the threshold between tourists staying at a hotel versus residents who bought a permanent home.'
      },
      {
        title: 'The Cycle Dance: Who is Selling to Whom?',
        text: 'In bear markets and accumulation phases, LTH supply climbs to 70-76% as conviction investors lock coins away. During bull peaks, LTH supply drops sharply as seasoned holders sell their coins into eager new retail buyers (Short-Term Holders).',
        callout: 'Watching LTH supply changes gives you a direct window into the behavior of smart money.'
      }
    ],
    quiz: {
      question: 'What typically happens to Long-Term Holder supply during the final explosive phase of a Bitcoin bull market?',
      options: [
        'It skyrockets to 99% as everyone refuses to sell',
        'It drops significantly as long-term holders distribute coins to incoming retail buyers',
        'It stays exactly flat because LTHs never sell',
        'It turns negative due to exchange liquidations'
      ],
      correctIndex: 1,
      explanation: 'During cycle peaks, experienced long-term holders gradually distribute their low-cost coins to newly arriving retail and momentum traders who absorb the supply at elevated prices.'
    }
  },
  {
    id: 'lesson-5',
    slug: 'nupl-market-psychology',
    title: 'NUPL & Market Psychology',
    subtitle: 'Mapping market sentiment from capitulation to euphoria',
    estimatedMinutes: 5,
    coreQuestion: 'Can we measure collective market emotion using mathematics rather than Twitter sentiment?',
    simpleTakeaway: 'NUPL (Net Unrealized Profit/Loss) calculates the exact percentage of market cap that exists as paper profit vs paper loss, mapping the market into psychological phases.',
    interactiveModel: 'nupl',
    sections: [
      {
        title: 'The Sentiment Spectrum',
        text: 'NUPL divides paper gains by total market cap: Negative values represent Capitulation (holders in net loss). 0.0 to 0.25 represents Hope. 0.25 to 0.50 is Optimism. 0.50 to 0.70 is Belief. Above 0.70 is Euphoria.',
        analogy: 'When everyone at a dinner party is bragging about how much money they made on crypto, NUPL is above 0.70. When nobody wants to mention the word Bitcoin, NUPL is below 0.'
      }
    ],
    quiz: {
      question: 'What psychological phase corresponds to a NUPL reading above 0.70?',
      options: [
        'Capitulation and Despair',
        'Cautious Hope',
        'Euphoria / Extreme Greed',
        'Miner Bankruptcy'
      ],
      correctIndex: 2,
      explanation: 'NUPL above 0.70 means over 70% of Bitcoin’s total market value is pure unrealized paper profit, which historically triggered retail euphoria and profit-taking.'
    }
  },
  {
    id: 'lesson-6',
    slug: 'hashrate-difficulty-security',
    title: 'Hashrate & Network Security',
    subtitle: 'The thermodynamic shield protecting Bitcoin',
    estimatedMinutes: 4,
    coreQuestion: 'How does Bitcoin ensure that no government, corporation, or hacker can alter transactions?',
    simpleTakeaway: 'Global miners commit over 700 Exahashes (700 quintillion calculations) every single second. Reversing a transaction would require rewriting this immense energy-backed computational fortress.',
    interactiveModel: 'hashrate',
    sections: [
      {
        title: 'Proof-of-Work: The Energy Anchor',
        text: 'Bitcoin miners compete to find a cryptographic solution to package transactions into blocks. The total guessing power is known as Hashrate. Higher hashrate makes reorganizing or attacking the blockchain exponentially more expensive.',
        analogy: 'Hashrate is the concrete thickness of the vault walls; Difficulty is the lock mechanism that automatically adjusts every 2,016 blocks (about 2 weeks) to ensure blocks arrive every 10 minutes on average.'
      }
    ],
    quiz: {
      question: 'How often does Bitcoin’s mining difficulty adjust to keep block times near 10 minutes?',
      options: [
        'Every single block (10 minutes)',
        'Every 2,016 blocks (roughly every two weeks)',
        'Once a year during the halving',
        'When the Bitcoin core developers vote'
      ],
      correctIndex: 1,
      explanation: 'Every 2,016 blocks (approximately 14 days), the Bitcoin protocol automatically evaluates how fast blocks were mined and recalibrates difficulty up or down.'
    }
  }
];
