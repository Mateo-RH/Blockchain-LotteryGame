import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';

class LotteryIndex extends Component {
  static async getInitialProps() {
    const lotteries = await factory.methods.getDeployedLotteries().call();
    return { lotteries };
  }

  renderLotteries() {
    const items = this.props.lotteries.map(address => {
      return {
        header: address,
        description: <a>View Lottery</a>,
        fluid: true,
        style: { overflowWrap: 'break-word' }
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Lotteries</h3>
          <Button
            content="Create Lottery"
            icon="add circle"
            primary
            floated="right"
          />
          {this.renderLotteries()}
        </div>
      </Layout>
    );
  }
}

export default LotteryIndex;
