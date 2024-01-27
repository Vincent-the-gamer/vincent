<template>
    <div class="backwrap gradient">
        <div class="back-shapes">
            <span class="floating circle"
                style="top:66.59856996935649%;left:13.020833333333334%;animation-delay:-0.9s;"></span>
            <span class="floating triangle" style="top:31.46067415730337%;left:33.59375%;animation-delay:-4.8s;"></span>
            <span class="floating cross"
                style="top:76.50663942798774%;left:38.020833333333336%;animation-delay:-4s;"></span>
            <span class="floating square" style="top:21.450459652706844%;left:14.0625%;animation-delay:-2.8s;"></span>
            <span class="floating square"
                style="top:58.12053115423902%;left:56.770833333333336%;animation-delay:-2.15s;"></span>
            <span class="floating square"
                style="top:8.682328907048008%;left:72.70833333333333%;animation-delay:-1.9s;"></span>
            <span class="floating cross"
                style="top:31.3585291113381%;left:58.541666666666664%;animation-delay:-0.65s;"></span>
            <span class="floating cross"
                style="top:69.96935648621042%;left:81.45833333333333%;animation-delay:-0.4s;"></span>
            <span class="floating circle" style="top:15.117466802860061%;left:32.34375%;animation-delay:-4.1s;"></span>
            <span class="floating circle"
                style="top:13.074565883554648%;left:45.989583333333336%;animation-delay:-3.65s;"></span>
            <span class="floating cross"
                style="top:55.87334014300306%;left:27.135416666666668%;animation-delay:-2.25s;"></span>
            <span class="floating cross" style="top:49.54034729315628%;left:53.75%;animation-delay:-2s;"></span>
            <span class="floating cross"
                style="top:34.62717058222676%;left:49.635416666666664%;animation-delay:-1.55s;"></span>
            <span class="floating cross"
                style="top:33.19713993871297%;left:86.14583333333333%;animation-delay:-0.95s;"></span>
            <span class="floating square"
                style="top:28.19203268641471%;left:25.208333333333332%;animation-delay:-4.45s;"></span>
            <span class="floating circle"
                style="top:39.7344228804903%;left:10.833333333333334%;animation-delay:-3.35s;"></span>
            <span class="floating triangle"
                style="top:77.83452502553627%;left:24.427083333333332%;animation-delay:-2.3s;"></span>
            <span class="floating triangle"
                style="top:2.860061287027579%;left:47.864583333333336%;animation-delay:-1.75s;"></span>
            <span class="floating triangle"
                style="top:71.3993871297242%;left:66.45833333333333%;animation-delay:-1.25s;"></span>
            <span class="floating triangle"
                style="top:31.256384065372828%;left:76.92708333333333%;animation-delay:-0.65s;"></span>
            <span class="floating triangle" style="top:46.47599591419816%;left:38.90625%;animation-delay:-0.35s;"></span>
            <span class="floating cross"
                style="top:3.4729315628192032%;left:19.635416666666668%;animation-delay:-4.3s;"></span>
            <span class="floating cross" style="top:3.575076608784474%;left:6.25%;animation-delay:-4.05s;"></span>
            <span class="floating cross"
                style="top:77.3237997957099%;left:4.583333333333333%;animation-delay:-3.75s;"></span>
            <span class="floating cross"
                style="top:0.9193054136874361%;left:71.14583333333333%;animation-delay:-3.3s;"></span>
            <span class="floating square" style="top:23.6976506639428%;left:63.28125%;animation-delay:-2.1s;"></span>
            <span class="floating square" style="top:81.30745658835546%;left:45.15625%;animation-delay:-1.75s;"></span>
            <span class="floating square"
                style="top:60.9805924412666%;left:42.239583333333336%;animation-delay:-1.45s;"></span>
            <span class="floating square" style="top:29.009193054136876%;left:93.90625%;animation-delay:-1.05s;"></span>
            <span class="floating square" style="top:52.093973442288046%;left:68.90625%;animation-delay:-0.7s;"></span>
            <span class="floating square" style="top:81.51174668028601%;left:83.59375%;animation-delay:-0.35s;"></span>
            <span class="floating square"
                style="top:11.542390194075587%;left:91.51041666666667%;animation-delay:-0.1s;"></span>
        </div>
    </div>
</template>

<style scoped>
.backwrap {
    background-color: transparent;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -2;
}

/* Shapes & Animation
*/

.back-shapes {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.back-shapes img {
    opacity: 0.2;
    position: absolute;
    width: 1.5%;
}

.floating {
    position: absolute;
    animation-name: floating;
    -webkit-animation-name: floating;
    animation-duration: 5s;
    -webkit-animation-duration: 5s;
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;

    &.circle {
        display: inline-block;
        width: 39px;
        height: 39px;
        background-image: url('/circle.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        opacity: .3;
    }

    &.square {
        display: inline-block;
        width: 35px;
        height: 35px;
        background-image: url('/square.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        opacity: .3;
    }

    &.triangle {
        display: inline-block;
        width: 35px;
        height: 35px;
        background-image: url('/triangle.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        opacity: .3;
    }

    &.cross {
        display: inline-block;
        width: 35px;
        height: 35px;
        background-image: url('/cross.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        opacity: .3;
    }
}

@keyframes floating {
    0% {
        transform: translateY(0%) rotate(-55deg);
    }

    50% {
        transform: translateY(300%) rotate(55deg);
    }

    100% {
        transform: translateY(0%) rotate(-55deg);
    }
}

@-webkit-keyframes floating {
    0% {
        -webkit-transform: translateY(0%);
    }

    50% {
        -webkit-transform: translateY(300%);
    }

    100% {
        -webkit-transform: translateY(0%);
    }
}</style>