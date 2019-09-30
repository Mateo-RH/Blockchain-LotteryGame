import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';

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
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <h3>Open Lotteries</h3>
        <br></br>
        {this.renderLotteries()}
        <Button content="Create Campaign" icon="add circle" primary />
      </div>
    );
  }
}

export default LotteryIndex;
