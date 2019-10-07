import React, { useState, useEffect, useRef, useImperativeHandle , useLayoutEffect} from 'react'
import styled from 'styled-components'
import G6 from '@antv/g6'

// const StyledContainer = styled.div`
//     background: url(./../../images/g6/bg.png) no-repeat;

//     > canvas {
   
//     }

// `

import './index.css'
const Grid = require('@antv/g6/build/grid');

const G6Container = (props, ref) => {
    const [ graph, setGraph ] = useState(null)

    const refContainer = useRef(null)

    useEffect(() => {
        const grid = new Grid();
        const { current } = refContainer
        let { clientWidth, clientHeight } = current

        const graph = new G6.Graph({
            plugins: [ grid ],
            container: 'mountNode',  // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
            width: clientWidth,              // Number，必须，图的宽度
            height: clientHeight,             // Number，必须，图的高度
            defaultNode: {
                shape: 'image',
                clipCfg: {
                    show: true,
                    type: 'rect',
                    x: -50,
                    y: -50,
                    width: 100, 
                    height: 100
                }
            },
            defaultEdge: {           // 边在默认状态下的一般配置和样式配置（style）
                style: {               // 边样式配置
                  opacity: 0.6,        // 边透明度
                  stroke: 'red',       // 边描边颜色
                  lineDash: [5, 15, 25] 
                },
                labelCfg: {            // 边上的标签文本配置
                  autoRotate: true     // 边上的标签文本根据边的方向旋转
                }
            },
            modes: {
                default: [ 'drag-node', 'drag-canvas', 'zoom-canvas' ]  // 允许拖拽画布、放缩画布
            }
          })
        setGraph(graph)
        const resizeFn = () => {
            const { current } = refContainer
            let { clientWidth, clientHeight } = current // TODO document.body.clientWidth
            graph && graph.changeSize(clientWidth, clientHeight)
        }
        window.addEventListener('resize', resizeFn)
        return () => {
            window.removeEventListener('resize', resizeFn)
            graph.destory()
        }
    }, [])



    useEffect(() => {
        if (graph) {
            graph.data(props.data);  // 读取 Step 2 中的数据源到图上
            graph.render()
        }
    }, [graph, props.data])

    useImperativeHandle(ref, () => ({
        /**
         * @return {{}} {node, edge}
         */
        save: () => {
            return graph.save()
        }
    }))

    return (
        <div className="blade__insight__index" ref={refContainer}>
            <div id="mountNode" className="g6__contaniner"></div>
        </div>
    )
}

export default React.forwardRef(G6Container)