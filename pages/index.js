import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class LotteryIndex extends Component {
  static async getInitialProps() {
    const lotteries = await factory.methods.getDeployedLotteries().call();
    return { lotteries };
  }

  renderLotteries() {
    const items = this.props.lotteries.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/lotteries/${address}`}>
            <a>View Lottery</a>
          </Link>
        ),
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
          <Link route="/lotteries/new">
            <a href="">
              <Button
                content="Create Lottery"
                icon="add circle"
                primary
                floated="right"
              />
            </a>
          </Link>
          {this.renderLotteries()}
        </div>
      </Layout>
    );
  }
}

export default LotteryIndex;
