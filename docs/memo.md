# APIを試した記録

## bun run dev -- account:summary

```json
{
  "result": {
    "event_time": "1783510640300806695",
    "sub_account_id": "4728466592861559",
    "margin_type": "SIMPLE_CROSS_MARGIN",
    "settle_currency": "USDT",
    "unrealized_pnl": "0.0",
    "total_equity": "0.0",
    "initial_margin": "0.0",
    "maintenance_margin": "0.0",
    "available_balance": "0.0",
    "spot_balances": [],
    "positions": [],
    "settle_index_price": "1.0",
    "derisk_margin": "0.0",
    "derisk_to_maintenance_margin_ratio": "1.0",
    "total_cross_equity": "0.0",
    "cross_unrealized_pnl": "0.0",
    "sub_account_mode": "SINGLE_ASSET_MODE",
    "margin_balance": "0.0"
  }
}
```

## bun run dev -- market:funding --limit 24

```json
{
  "result": [
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0385",
      "funding_time": "1783497600000000000",
      "mark_price": "62806.570258864",
      "funding_rate_8_h_avg": "-0.0385",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0792",
      "funding_time": "1783468800000000000",
      "mark_price": "63273.906474945",
      "funding_rate_8_h_avg": "-0.0792",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.1356",
      "funding_time": "1783440000000000000",
      "mark_price": "63854.482664421",
      "funding_rate_8_h_avg": "-0.1356",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0111",
      "funding_time": "1783411200000000000",
      "mark_price": "63011.444292345",
      "funding_rate_8_h_avg": "-0.0111",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0365",
      "funding_time": "1783382400000000000",
      "mark_price": "64019.221982014",
      "funding_rate_8_h_avg": "-0.0365",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0664",
      "funding_time": "1783353600000000000",
      "mark_price": "63487.396899593",
      "funding_rate_8_h_avg": "-0.0664",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0038",
      "funding_time": "1783324800000000000",
      "mark_price": "63066.221162467",
      "funding_rate_8_h_avg": "-0.0038",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.1282",
      "funding_time": "1783296000000000000",
      "mark_price": "63620.492912264",
      "funding_rate_8_h_avg": "-0.1282",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0105",
      "funding_time": "1783267200000000000",
      "mark_price": "62681.126221516",
      "funding_rate_8_h_avg": "-0.0105",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0199",
      "funding_time": "1783238400000000000",
      "mark_price": "62997.300044139",
      "funding_rate_8_h_avg": "-0.0199",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0034",
      "funding_time": "1783209600000000000",
      "mark_price": "63114.555681224",
      "funding_rate_8_h_avg": "-0.0034",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.01",
      "funding_time": "1783180800000000000",
      "mark_price": "62911.800006296",
      "funding_rate_8_h_avg": "-0.01",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0059",
      "funding_time": "1783152000000000000",
      "mark_price": "62555.111419419",
      "funding_rate_8_h_avg": "-0.0059",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0107",
      "funding_time": "1783123200000000000",
      "mark_price": "62586.958794844",
      "funding_rate_8_h_avg": "-0.0107",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0206",
      "funding_time": "1783094400000000000",
      "mark_price": "61896.374295804",
      "funding_rate_8_h_avg": "-0.0206",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0011",
      "funding_time": "1783065600000000000",
      "mark_price": "61739.700015453",
      "funding_rate_8_h_avg": "-0.0011",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0025",
      "funding_time": "1783036800000000000",
      "mark_price": "61529.324586706",
      "funding_rate_8_h_avg": "-0.0025",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0431",
      "funding_time": "1783008000000000000",
      "mark_price": "61584.033957367",
      "funding_rate_8_h_avg": "-0.0431",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0162",
      "funding_time": "1782979200000000000",
      "mark_price": "60121.395899542",
      "funding_rate_8_h_avg": "-0.0162",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0313",
      "funding_time": "1782950400000000000",
      "mark_price": "59995.64525879",
      "funding_rate_8_h_avg": "-0.0313",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.1401",
      "funding_time": "1782921600000000000",
      "mark_price": "60125.804623088",
      "funding_rate_8_h_avg": "-0.1401",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0319",
      "funding_time": "1782892800000000000",
      "mark_price": "58743.463603999",
      "funding_rate_8_h_avg": "-0.0319",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.0069",
      "funding_time": "1782864000000000000",
      "mark_price": "58604.919218011",
      "funding_rate_8_h_avg": "-0.0069",
      "funding_interval_hours": 8
    },
    {
      "instrument": "BTC_USDT_Perp",
      "funding_rate": "-0.1309",
      "funding_time": "1782835200000000000",
      "mark_price": "58356.817975574",
      "funding_rate_8_h_avg": "-0.1309",
      "funding_interval_hours": 8
    }
  ],
  "next": "eyJmdW5kaW5nVGltZSI6MTc4MjgzNTIwMDAwMDAwMDAwMH0"
}
```

## bun run dev -- market:trades --limit 20

```json
{
  "result": [
    {
      "event_time": "1783509010065633348",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.005",
      "price": "62095.9",
      "mark_price": "62083.284230139",
      "index_price": "62110.297921987",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170282809-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509010479004810",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.005",
      "price": "62006.2",
      "mark_price": "62083.28896574",
      "index_price": "62112.009590185",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170282814-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509011622442512",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.005",
      "price": "62095.9",
      "mark_price": "62084.986131738",
      "index_price": "62112.009590185",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170282821-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509012057122409",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.005",
      "price": "62006.2",
      "mark_price": "62084.986131738",
      "index_price": "62112.009590185",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170282822-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509016195439571",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.005",
      "price": "62095.9",
      "mark_price": "62083.6530068",
      "index_price": "62109.867681863",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170282849-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509021723953005",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.005",
      "price": "62006.2",
      "mark_price": "62082.479345387",
      "index_price": "62109.636976843",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170282874-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509046932095650",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.005",
      "price": "62081.6",
      "mark_price": "62073.653123883",
      "index_price": "62100.993906583",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170282990-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509053389841582",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.005",
      "price": "62006.2",
      "mark_price": "62071.213553802",
      "index_price": "62097.992499528",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170283019-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509114635584659",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.005",
      "price": "62001.7",
      "mark_price": "61984.058561996",
      "index_price": "62027.899458922",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170283300-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509121135457287",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.005",
      "price": "61983.2",
      "mark_price": "61990.717022595",
      "index_price": "62033.582075555",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170283329-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509159366100152",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.005",
      "price": "62035.1",
      "mark_price": "62034.971102482",
      "index_price": "62059.778701438",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170283509-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509159773167797",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.005",
      "price": "62004.2",
      "mark_price": "62034.971102482",
      "index_price": "62059.778701438",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170283511-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509889932941440",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.005",
      "price": "62056.0",
      "mark_price": "61997.92048692",
      "index_price": "62037.299211889",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170286902-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509890645582006",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.005",
      "price": "61970.1",
      "mark_price": "61998.441795022",
      "index_price": "62037.299211889",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170286907-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509921736967064",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.009",
      "price": "62061.0",
      "mark_price": "62004.957389341",
      "index_price": "62031.768851459",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170287065-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783509922107352993",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.009",
      "price": "61970.1",
      "mark_price": "62004.957389341",
      "index_price": "62031.768851459",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170287066-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783510248837098066",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.002",
      "price": "62063.8",
      "mark_price": "62030.294675751",
      "index_price": "62056.057491615",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170288796-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783510283877065659",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.002",
      "price": "61943.5",
      "mark_price": "62056.94020667",
      "index_price": "62083.283064901",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170288939-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783510324386058989",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": true,
      "size": "0.002",
      "price": "62039.4",
      "mark_price": "62054.581814518",
      "index_price": "62086.072902581",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170289105-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    },
    {
      "event_time": "1783510339696922813",
      "instrument": "BTC_USDT_Perp",
      "is_taker_buyer": false,
      "size": "0.002",
      "price": "62022.5",
      "mark_price": "62040.563717115",
      "index_price": "62070.142127229",
      "interest_rate": "0.0",
      "forward_price": "0.0",
      "trade_id": "170289170-1",
      "venue": "ORDERBOOK",
      "is_rpi": false
    }
  ]
}
```

## bun run dev -- order:create --side buy --size 0.01 --price 50000

```json
{
  "dry_run": true,
  "reason": "order:create is dry-run only. Re-run with --execute --env testnet to send it.",
  "unsigned_order": {
    "sub_account_id": "4728466592861559",
    "is_market": false,
    "time_in_force": "GOOD_TILL_TIME",
    "post_only": false,
    "reduce_only": false,
    "legs": [
      {
        "instrument": "BTC_USDT_Perp",
        "size": "0.01",
        "limit_price": "50000",
        "is_buying_asset": true
      }
    ],
    "metadata": {
      "client_order_id": "9223372037226775808",
      "create_time": "1783512218372000000"
    },
    "builder": "0x0000000000000000000000000000000000000000",
    "builder_fee": "0"
  },
  "signed_payload": {
    "order": {
      "sub_account_id": "4728466592861559",
      "is_market": false,
      "time_in_force": "GOOD_TILL_TIME",
      "post_only": false,
      "reduce_only": false,
      "legs": [
        {
          "instrument": "BTC_USDT_Perp",
          "size": "0.01",
          "limit_price": "50000",
          "is_buying_asset": true
        }
      ],
      "metadata": {
        "client_order_id": "9223372037226775808",
        "create_time": "1783512218372000000"
      },
      "builder": "0x0000000000000000000000000000000000000000",
      "builder_fee": "0",
      "signature": {
        "signer": "0x5402d5C7F3DDF48B7Af084450F39f25A7faDd181",
        "r": "0x4e1720cada9b1cb8ba6ab62dfdab3f325c77d548543f208621a0ea38872f5f20",
        "s": "0x4ace550492fd04bd2124ef7e356c73a09f5e95a94bcbeae26291a34a272b5810",
        "v": 27,
        "expiration": "1783598618390000000",
        "nonce": 671740766,
        "chain_id": "326"
      }
    }
  }
}
```