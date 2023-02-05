import ImageGallery from "react-image-gallery";
import {css} from "styled-components/macro";

export type CarouselPropsType = {
  imgs: Array<{
    original: string;
    thumbnail: string;
  }>;
  imgH?: string;
};

export const Carousel = (props: CarouselPropsType): JSX.Element => {
  /*
  いくつかあるReact用Carouselライブラリの中から「react-image-gallery」を選択した．
  - Refs
    - https://alvarotrigo.com/blog/react-carousels/
    - https://www.npmjs.com/package/react-image-gallery
      - https://github.com/xiaolin/react-image-gallery
  */
  props = {
    ...{
      // デフォルト値
      imgs: [],
      imgH: "auto",
    },
    // 下記で上書き
    ...props
  };
  return (
    <div className="comp-carousel" css={scopedStyles.cssCarousel(props.imgH)}>
      <ImageGallery
        items={props.imgs}
        showThumbnails={true}
        showFullscreenButton={true}
        useBrowserFullscreen={false}
        showPlayButton={true}
        slideDuration={450}
        showIndex={false}
        autoPlay={false}
        disableThumbnailScroll={false}
        disableKeyDown={false}
        disableSwipe={false}
        disableThumbnailSwipe={false}
        thumbnailPosition="bottom"
      />
    </div>
  );
};

const scopedStyles = {
  cssCarousel: (imgH?: string) => css`
// https://stackoverflow.com/a/61580097/15842506
.image-gallery-slide .image-gallery-image {
  height: ${(imgH === undefined) ? "auto" : imgH}
}
`,
};
