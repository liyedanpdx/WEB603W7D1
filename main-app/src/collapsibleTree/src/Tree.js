import React, { Fragment, Component } from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { LinearGradient } from "@vx/gradient";
import { hierarchy } from "d3-hierarchy";
import Links from "./LinksMove";
import Nodes from "./NodesMove";

export default class App extends Component {
  state = {
    layout: "cartesian",
    orientation: "horizontal",
    linkType: "diagonal",
    stepPercent: 0.5
  };

  // 添加数据处理方法
  processData = (node) => {
    // 如果节点没有 isExpanded 属性，添加它
    if (node.isExpanded === undefined) {
      node.isExpanded = true;
    }
    // 如果有子节点，递归处理
    if (node.children) {
      node.children.forEach(this.processData);
    }
    return node;
  };

  render() {
    const {
      data,
      width,
      height,
      events = false,
      margin = {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
      }
    } = this.props;
    const { layout, orientation, linkType, stepPercent } = this.state;

    if (width < 10) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let origin;
    let sizeWidth;
    let sizeHeight;

    if (layout === "polar") {
      origin = {
        x: innerWidth / 2,
        y: innerHeight / 2
      };
      sizeWidth = 2 * Math.PI;
      sizeHeight = Math.min(innerWidth, innerHeight) / 2;
    } else {
      origin = { x: 0, y: 0 };
      if (orientation === "vertical") {
        sizeWidth = innerWidth;
        sizeHeight = innerHeight;
      } else {
        sizeWidth = innerHeight;
        sizeHeight = innerWidth;
      }
    }

    // 在创建层次结构之前处理数据
    const processedData = this.processData({...data});
    const root = hierarchy(processedData, d => (d.isExpanded ? d.children : null));

    return (
      <Fragment>
        <div style={{ margin: "10px 0px" }}>
          <span style={{ marginRight: 10 }}>
            <label>orientation:</label>
            <select
              onChange={e => this.setState({ orientation: e.target.value })}
              value={orientation}
              disabled={layout === "polar"}
            >
              <option value="vertical">vertical</option>
              <option value="horizontal">horizontal</option>
            </select>
          </span>
          <span>
            <label>link:</label>
            <select
              onChange={e => this.setState({ linkType: e.target.value })}
              value={linkType}
            >
              <option value="diagonal">diagonal</option>
              <option value="step">step</option>
              <option value="line">line</option>
            </select>
          </span>
        </div>
        <svg width={width} height={height}>
          <LinearGradient id="lg" from="#fff" to="#aaa" />
          <rect width={width} height={height} rx={14} fill="#888" />
          <Tree
            top={margin.top}
            left={margin.left}
            root={root}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
          >
            {({ data }) => (
              <Group top={origin.y} left={origin.x}>
                <Links
                  links={data.links()}
                  linkType={linkType}
                  layout={layout}
                  orientation={orientation}
                  stepPercent={stepPercent}
                />
                <Nodes
                  nodes={data.descendants()}
                  layout={layout}
                  orientation={orientation}
                  onNodeClick={node => {
                    if (!node.data.isExpanded) {
                      node.data.x0 = node.x;
                      node.data.y0 = node.y;
                    }
                    node.data.isExpanded = !node.data.isExpanded;
                    this.forceUpdate();
                  }}
                />
              </Group>
            )}
          </Tree>
        </svg>
      </Fragment>
    );
  }
}