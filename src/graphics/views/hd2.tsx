import '../styles/common.css';

import React from 'react';
import ReactDom from 'react-dom';
import styled, {css} from 'styled-components';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import background from '../images/background.png';

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		15px 0px,
		15px 163.5px,
		15px 690px,
		951px 690px,
		951px 163.5px,
		15px 163.5px,
		15px 0px,
		720px 0px,
		720px 705px,
		720px 1065px,
		1200px 1065px,
		1200px 705px,
		720px 705px,
		720px 0px,
		969px 0px,
		969px 163.5px,
		969px 690px,
		1905px 690px,
		1905px 163.5px,
		969px 163.5px,
		969px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 0;
	height: 180px;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: 0;
	width: ${(20 + 440 + 20) * 1.5}px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	right: 210px;
	width: 510px;
`;

const infoHeights = {
	primaryHeight: 68 * 1.5,
	secondaryHeight: 38 * 1.5,
};

const runnerStyle = css`
	position: absolute;
	top: ${(100 + 9 + 351 + 10) * 1.5}px;
	width: ${470 * 1.5}px;
	height: 60px;
`;
const LeftRunner = styled.div`
	${runnerStyle};
	left: 15px;
`;

const RightRunner = styled.div`
	${runnerStyle};
	right: 15px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: ${(100 + 9 + 351 + 10 + 40 + 10) * 1.5}px;
	right: 15px;
`;

const App = () => (
	<StyledContainer>
		<LeftRunner>
			<RtaijRunner index={0} showFinishTime gradientBackground />
		</LeftRunner>
		<RightRunner>
			<RtaijRunner index={1} showFinishTime gradientBackground />
		</RightRunner>
		<CommentatorContainer>
			<RtaijCommentator index={0} gradientBackground />
		</CommentatorContainer>
		<GameContainer>
			<RtaijGame {...infoHeights} />
		</GameContainer>
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>
		<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={180} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('hd2'));
