﻿module BABYLON {
    export class TextureTools {
		/**
		 * Uses the GPU to create a copy texture rescaled at a given size
		 * @param texture Texture to copy from
		 * @param width Desired width
		 * @param height Desired height
		 * @return Generated texture
		 */
		public static CreateResizedCopy(texture: BABYLON.Texture, width: number, height: number): BABYLON.Texture {
			let rtt = new BABYLON.RenderTargetTexture(
				'resized' + texture.name,
				{ width: width, height: height },
				scene,
				!texture.noMipmap,
				true,
				texture._texture.type,
				false,
				texture._samplingMode,
				false
			);

            var scene = texture.getScene();

			rtt.wrapU = texture.wrapU;
			rtt.wrapV = texture.wrapV;
            rtt.uOffset = texture.uOffset;
            rtt.vOffset = texture.vOffset;
            rtt.uScale = texture.uScale;
            rtt.vScale = texture.vScale;
            rtt.uAng = texture.uAng;
            rtt.vAng = texture.vAng;
            rtt.wAng = texture.wAng;
            rtt.coordinatesIndex = texture.coordinatesIndex;
            rtt.level = texture.level;
            rtt.anisotropicFilteringLevel = texture.anisotropicFilteringLevel;

            let passPostProcess = new BABYLON.PassPostProcess("pass", 1, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, Engine.TEXTURETYPE_UNSIGNED_INT, true);
            passPostProcess.updateEffect(null, null, null, null, () => {
                passPostProcess.onApply = function (effect) {
                    effect.setTexture("textureSampler", texture);
                }

                scene.postProcessManager.directRender([passPostProcess], rtt.getInternalTexture());

                scene.getEngine().restoreDefaultFramebuffer();
                rtt.disposeFramebufferObjects();
				passPostProcess.dispose();
            });

			return rtt;
		}        
    }
} 