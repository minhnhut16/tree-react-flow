// eslint-disable-next-line import/prefer-default-export
export const TreeObject = {
  name: 'test_credit_score',
  client_code: 'demo_bank',
  uuid: '7998f978-eada-4e8d-9c44-537d3d3f11c4',
  active: true,
  root: {
    name: 'root',
    nodes: [
      {
        name: 'high_score_customer',
        title: 'High Score Customer',
        evaluation: 'conv_number(credit_score ?? 0) >= 700',
        scoring: '350 + (conv_number(age ?? 0) > 28 ? 20.5 : 10.5)',
        output: {
          next_action: 'disbursement',
          data: {
            flow: 'auto',
            mortgage: 50,
          },
        },
        nodes: [
          {
            name: 'high_income',
            title: 'High Income',
            evaluation: '(conv_number(income ?? 0) >= 30000000)',
            scoring: '($.high_score_customer.score ?? 0) + 30.7',
            output: {
              next_action: 'approved',
              data: {
                flow: 'auto',
                mortgage: 3000000000,
                message: 'Hạn mức thẻ 300 triệu VND',
              },
            },
          },
          {
            name: 'high_income2',
            title: 'High Income2',
            evaluation: '(conv_number(income ?? 0) >= 30000000)',
            scoring: '($.high_score_customer.score ?? 0) + 30.7',
            output: {
              next_action: 'approved',
              data: {
                flow: 'auto',
                mortgage: 3000000000,
                message: 'Hạn mức thẻ 300 triệu VND',
              },
            },
          },
          {
            name: 'high_income3',
            title: 'High Income3',
            evaluation: '(conv_number(income ?? 0) >= 30000000)',
            scoring: '($.high_score_customer.score ?? 0) + 30.7',
            output: {
              next_action: 'approved',
              data: {
                flow: 'auto',
                mortgage: 3000000000,
                message: 'Hạn mức thẻ 300 triệu VND',
              },
            },
          },
          {
            name: 'high_income4',
            title: 'High Income4',
            evaluation: '(conv_number(income ?? 0) >= 30000000)',
            scoring: '($.high_score_customer.score ?? 0) + 30.7',
            output: {
              next_action: 'approved',
              data: {
                flow: 'auto',
                mortgage: 3000000000,
                message: 'Hạn mức thẻ 300 triệu VND',
              },
            },
          },
        ],
        fallback: {
          name: 'fallback_high_score_customer',
          scoring: '5',
          output: {
            next_action: 'approved',
            data: {
              flow: 'auto',
              mortgage: 50000000,
              message: 'Hạn mức thẻ 50 triệu VND',
            },
          },
        },
      },
      {
        name: 'medium_score_customer',
        title: 'Medium Score Customer',
        evaluation: 'range_number(credit_score ?? 0, 650, 700)',
        scoring: '(income ?? 0) >= 10000000 ? 600 : 400',
        output: {
          next_action: 'document',
          next_state: 'new_state',
        },
      },
      {
        name: 'new_node',
        title: 'reject',
        evaluation: '1 == 1',
        scoring: '',
        output: {
          status: 'rejected',
        },
      },
      {
        name: 'high_fraud_score',
        title: 'High fraud score',
        evaluation: 'conv_number(fraud_score ?? 0) > 750',
        is_representative_node: true,
        output: {
          status: 'rejected',
        },
        nodes: [
          {
            name: 'high_income',
            title: 'High Income',
            evaluation: '(conv_number(income ?? 0) >= 30000000)',
            scoring: '($.high_score_customer.score ?? 0) + 30.7',
            output: {
              next_action: 'approved',
              data: {
                flow: 'auto',
                mortgage: 3000000000,
                message: 'Hạn mức thẻ 300 triệu VND',
              },
            },
          },
        ],
      },
      {
        name: 'New node',
        title: 'new Node',
        evaluation: '(conv_number(income ?? 0) >= 30000000)',
        scoring: '($.high_score_customer.score ?? 0) + 30.7',
        nodes: [
          {
            name: 'New node',
            title: 'new Node',
            evaluation: '(conv_number(income ?? 0) >= 30000000)',
            scoring: '($.high_score_customer.score ?? 0) + 30.7',
          },
        ],
      },
      {
        name: 'New node',
        title: 'new Node',
        evaluation: '(conv_number(income ?? 0) >= 30000000)',
        scoring: '($.high_score_customer.score ?? 0) + 30.7',
      },
      {
        name: 'New node',
        title: 'new Node',
        evaluation: '(conv_number(income ?? 0) >= 30000000)',
        scoring: '($.high_score_customer.score ?? 0) + 30.7',
      },
      {
        name: 'New node',
        title: 'new Node',
        evaluation: '(conv_number(income ?? 0) >= 30000000)',
        scoring: '($.high_score_customer.score ?? 0) + 30.7',
      },
    ],
    fallback: {
      name: 'fallback_root',
      title: 'Low Score Customer',
      scoring: '(income ?? 0) >= 10000000 ? 400 :350',
      output: {
        next_action: 'rejected',
        data: {},
      },
    },
  },
};
