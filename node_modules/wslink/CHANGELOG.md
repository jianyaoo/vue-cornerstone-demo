## [1.12.4](https://github.com/kitware/wslink/compare/v1.12.3...v1.12.4) (2023-10-25)


### Bug Fixes

* **logging:** implement scoped logging ([#152](https://github.com/kitware/wslink/issues/152)) ([07094c3](https://github.com/kitware/wslink/commit/07094c3d6ee502a5e35a1f9aa0c0e88fac377f9c)), closes [#151](https://github.com/kitware/wslink/issues/151)

## [1.12.3](https://github.com/kitware/wslink/compare/v1.12.2...v1.12.3) (2023-10-05)


### Bug Fixes

* **backend:** properly handle async run state for generic ([247b046](https://github.com/kitware/wslink/commit/247b0460f96c7277fb597b8dced80d81c65cba0a))

## [1.12.2](https://github.com/kitware/wslink/compare/v1.12.1...v1.12.2) (2023-09-27)


### Bug Fixes

* **ci:** semantic-release automation ([5967efc](https://github.com/kitware/wslink/commit/5967efc2811dcfa662dd51e4388c973c0403f4d5))

# [1.12.0](https://github.com/kitware/wslink/compare/v1.11.4...v1.12.0) (2023-09-27)


### Features

* **jupyter:** Add jupyter backend ([db1bb39](https://github.com/kitware/wslink/commit/db1bb3943093b1f420bf30f4d887893b556fccc9))

## [1.11.4](https://github.com/kitware/wslink/compare/v1.11.3...v1.11.4) (2023-09-06)


### Bug Fixes

* **protocol:** const definition and usage ([0c34a25](https://github.com/kitware/wslink/commit/0c34a25456611cebf80be801b58c993bdee3b3f5))

## [1.11.3](https://github.com/kitware/wslink/compare/v1.11.2...v1.11.3) (2023-09-05)


### Bug Fixes

* **pub_manager:** handle old global publish manager ([d842b88](https://github.com/kitware/wslink/commit/d842b88d841f9c560bc534a5647f3ffcdcd1c070)), closes [#146](https://github.com/kitware/wslink/issues/146)

## [1.11.2](https://github.com/kitware/wslink/compare/v1.11.1...v1.11.2) (2023-08-30)


### Bug Fixes

* **publish_manager:** separation at server level for broadcast ([ffd269d](https://github.com/kitware/wslink/commit/ffd269d152abec57b8590f3c7e52172eb9841c91))

## [1.11.1](https://github.com/kitware/wslink/compare/v1.11.0...v1.11.1) (2023-06-30)


### Bug Fixes

* **aiohttp:** use app var instead of inheritance ([a0c7e64](https://github.com/kitware/wslink/commit/a0c7e64c6d18dd7e781ee59fae530fd29e130b00))
* **js:** Allow JS to use custom WebSocket implementation ([f7fad26](https://github.com/kitware/wslink/commit/f7fad26c58f3808c28cca0f20a3e90d8253c391c))

# [1.11.0](https://github.com/kitware/wslink/compare/v1.10.2...v1.11.0) (2023-06-09)


### Features

* **backend:** Add generic backend ([d1b2b1b](https://github.com/kitware/wslink/commit/d1b2b1baa62f46215aed426fa1d90d3799cc3398))
* **backend:** Add tornado using the generic backend ([ee15e86](https://github.com/kitware/wslink/commit/ee15e86303b1e83d1c2bcb7a7b7e140012b9a22a))
* Rework code to simplify backends ([114c422](https://github.com/kitware/wslink/commit/114c4224b99cb67bacb44d43206fdc588fe22ce6))

## [1.10.2](https://github.com/kitware/wslink/compare/v1.10.1...v1.10.2) (2023-05-19)


### Bug Fixes

* **SmartConnect:** Allow delete to call exit later ([eeb7637](https://github.com/kitware/wslink/commit/eeb76372e55e6f0b1a9717c679400407997f303a))

## [1.10.1](https://github.com/kitware/wslink/compare/v1.10.0...v1.10.1) (2023-02-15)


### Bug Fixes

* **gracefulexit:** handle server exit for exec_mode=main ([9e06313](https://github.com/kitware/wslink/commit/9e063134b8e171116b374e80fa1ddcd790ca5109))
* **json5:** Bump version ([4d2e972](https://github.com/kitware/wslink/commit/4d2e9725199d3504897b2419880b07bdc606048c))

# [1.10.0](https://github.com/kitware/wslink/compare/v1.9.3...v1.10.0) (2022-12-20)


### Features

* **launcher:** Make GET/DELETE endpoint optionals ([2dc2916](https://github.com/kitware/wslink/commit/2dc291639fc8fc709c9969df6f1872a19a9b51a0))

## [1.9.3](https://github.com/kitware/wslink/compare/v1.9.2...v1.9.3) (2022-12-19)


### Bug Fixes

* **launcher:** get/delete now works ([c95a23d](https://github.com/kitware/wslink/commit/c95a23d87d0360d68e1a58c3dbe63757e9268818))

## [1.9.2](https://github.com/kitware/wslink/compare/v1.9.1...v1.9.2) (2022-12-08)


### Bug Fixes

* **sessionManagerURL:** Make it path relative aware like default sessionURL ([7c351a3](https://github.com/kitware/wslink/commit/7c351a3d7a1b0b3ecd658ea99150ccee68a688ad))

## [1.9.1](https://github.com/kitware/wslink/compare/v1.9.0...v1.9.1) (2022-11-01)


### Bug Fixes

* **clientSession:** Make reverse connection subscriptable ([bb672ca](https://github.com/kitware/wslink/commit/bb672ca1ac5be92b015cb4479d4ac1409558de5c))
* **subscriptable:** fix typo ([13b60c5](https://github.com/kitware/wslink/commit/13b60c55f5e182232c8b1ced92db35ed52c92933))

# [1.9.0](https://github.com/kitware/wslink/compare/v1.8.4...v1.9.0) (2022-10-20)


### Features

* **skip_last_active_client:** Better network handling for collaboration ([e4844e6](https://github.com/kitware/wslink/commit/e4844e6c395eb4de8b4223397108127ce24bfa25))

## [1.8.4](https://github.com/kitware/wslink/compare/v1.8.3...v1.8.4) (2022-10-13)


### Bug Fixes

* **ws_server:** handle client disconnection even in case of error ([0fa664e](https://github.com/kitware/wslink/commit/0fa664e9b04599c92337e1b9547fb8534fb90eca)), closes [#118](https://github.com/kitware/wslink/issues/118)

## [1.8.3](https://github.com/kitware/wslink/compare/v1.8.2...v1.8.3) (2022-10-13)


### Bug Fixes

* **security:** publish messages only to authenticated clients ([c630baa](https://github.com/kitware/wslink/commit/c630baae5a4b5daea74cbb63d3ab6edfb41b8c55))

## [1.8.2](https://github.com/kitware/wslink/compare/v1.8.1...v1.8.2) (2022-08-24)


### Bug Fixes

* **ssl:** forgot to import ssl from .ssl_context ([d1f5f71](https://github.com/kitware/wslink/commit/d1f5f71d3aa2c2bb060e72ec5d96dbf4f8fc9c19))

## [1.8.1](https://github.com/kitware/wslink/compare/v1.8.0...v1.8.1) (2022-08-24)


### Bug Fixes

* **ssl:** make import optional for ParaView ([be11056](https://github.com/kitware/wslink/commit/be1105641524f44127b97179924e57a29530cce6))

# [1.8.0](https://github.com/kitware/wslink/compare/v1.7.0...v1.8.0) (2022-08-24)


### Features

* **SSL:** support ssl context ([00eed08](https://github.com/kitware/wslink/commit/00eed083ae6ac9679d48ba3193c727cd692a74e3))

# [1.7.0](https://github.com/kitware/wslink/compare/v1.6.6...v1.7.0) (2022-08-11)


### Features

* **reverse-connection:** Add support for ClientWS and Relay service ([f62fef3](https://github.com/kitware/wslink/commit/f62fef31f310bbe28ee231184f4a3f78bb482b74))

## [1.6.6](https://github.com/kitware/wslink/compare/v1.6.5...v1.6.6) (2022-07-05)


### Bug Fixes

* **aiohttp:** Avoid newer, breaking versions ([de16350](https://github.com/kitware/wslink/commit/de1635053ca966c3732be4a86c860efe7608f28f))

## [1.6.5](https://github.com/kitware/wslink/compare/v1.6.4...v1.6.5) (2022-06-03)


### Bug Fixes

* **js:** Properly handle protocol mapping ([d02d41d](https://github.com/kitware/wslink/commit/d02d41de6755492115a8cb41fadd54662a696b60))

## [1.6.4](https://github.com/kitware/wslink/compare/v1.6.3...v1.6.4) (2022-05-05)


### Bug Fixes

* **ws_server:** Pass server at initialization ([758afe3](https://github.com/kitware/wslink/commit/758afe3a0b216fb706c9eed8af61e9b1a3135517))

## [1.6.3](https://github.com/kitware/wslink/compare/v1.6.2...v1.6.3) (2022-05-04)


### Bug Fixes

* **startup-msg:** Allow user to override startup message ([eda7a11](https://github.com/kitware/wslink/commit/eda7a11856ca719cbe54ec12c7aa10f3fa0fc25a))

## [1.6.2](https://github.com/kitware/wslink/compare/v1.6.1...v1.6.2) (2022-05-04)


### Bug Fixes

* **ws:** ensure valid ws before write ([3ba4e60](https://github.com/kitware/wslink/commit/3ba4e601e6fdcc04a5929df3e46e9ec3b26ded89))

## [1.6.1](https://github.com/kitware/wslink/compare/v1.6.0...v1.6.1) (2022-04-28)


### Bug Fixes

* **auth,log:** strip secret from logged messages ([dec6080](https://github.com/kitware/wslink/commit/dec60800d55aa90e8a38d7f2a6af08023e6497d4))

# [1.6.0](https://github.com/kitware/wslink/compare/v1.5.3...v1.6.0) (2022-04-26)


### Features

* **timeout:** allow server without shutdown timeout ([3200728](https://github.com/kitware/wslink/commit/3200728c535c25bd30c031c0936a2c984fe3a7f8))

## [1.5.3](https://github.com/kitware/wslink/compare/v1.5.2...v1.5.3) (2022-04-14)


### Bug Fixes

* **security:** Allow to defer token validation to external method ([06bec0d](https://github.com/kitware/wslink/commit/06bec0d5d4b98da90310dc5eca6fc1add09e33e4))

## [1.5.2](https://github.com/kitware/wslink/compare/v1.5.1...v1.5.2) (2022-04-08)


### Bug Fixes

* **py3.6:** use get_event_loop instead of get_running_loop ([1b2343c](https://github.com/kitware/wslink/commit/1b2343c9a3ff514e79e93a45796cc2db914f129d))

## [1.5.1](https://github.com/kitware/wslink/compare/v1.5.0...v1.5.1) (2022-04-04)


### Bug Fixes

* **license:** include LICENSE file in wheel ([615b8d6](https://github.com/kitware/wslink/commit/615b8d6cd216388693867f58129230c84eaea782))

# [1.5.0](https://github.com/kitware/wslink/compare/v1.4.3...v1.5.0) (2022-04-01)


### Features

* **exec_mode:** add exec_mode to start_webserver ([011d387](https://github.com/kitware/wslink/commit/011d387165c4859958f3f99b33227723dcf34944))

## [1.4.3](https://github.com/kitware/wslink/compare/v1.4.2...v1.4.3) (2022-03-04)


### Bug Fixes

* **queryString:** Keep queryString for index.html redicrect ([478ea09](https://github.com/kitware/wslink/commit/478ea096078c04b065210a55c941731be97343c7))

## [1.4.2](https://github.com/kitware/wslink/compare/v1.4.1...v1.4.2) (2022-03-04)


### Bug Fixes

* **relativePath:** add support for relative sessionURL and index.html ([4a53100](https://github.com/kitware/wslink/commit/4a5310095f1ffa23f45bbbccfe2f10a13a5e3e69))

## [1.4.1](https://github.com/kitware/wslink/compare/v1.4.0...v1.4.1) (2022-02-09)


### Bug Fixes

* **rpc:** better handling awaitable rpc ([e7eef8a](https://github.com/kitware/wslink/commit/e7eef8a11010682a44a1c0b845a2fe8ea4048623))

# [1.4.0](https://github.com/kitware/wslink/compare/v1.3.3...v1.4.0) (2022-02-08)


### Features

* **heartbeat:** Control heartbeat with WSLINK_HEART_BEAT env ([2348bcb](https://github.com/kitware/wslink/commit/2348bcbcb66d0a59932c4aabcaa5227893871dcf))

## [1.3.3](https://github.com/kitware/wslink/compare/v1.3.2...v1.3.3) (2022-01-24)


### Bug Fixes

* **ts:** update the type definitions for subscribe ([e300fda](https://github.com/kitware/wslink/commit/e300fda999dd67569228f372e08949a5da08b390))

## [1.3.2](https://github.com/kitware/wslink/compare/v1.3.1...v1.3.2) (2022-01-24)


### Bug Fixes

* **js:** Add more type annotations ([5870064](https://github.com/kitware/wslink/commit/58700644712c4ed87144cf33ac086015b34bc4af))

## [1.3.1](https://github.com/kitware/wslink/compare/v1.3.0...v1.3.1) (2022-01-03)


### Bug Fixes

* **python:** use print for the startup message, not log.critical ([bee2f52](https://github.com/kitware/wslink/commit/bee2f520f010a6d2010a8039cd0b734489f10379))

# [1.3.0](https://github.com/kitware/wslink/compare/v1.2.1...v1.3.0) (2021-12-16)


### Features

* **connection:** forward request+client_id to life cycle methods ([6c82264](https://github.com/kitware/wslink/commit/6c82264261344d245e3874a30bc65dfd7bb0fa6e))

## [1.2.1](https://github.com/kitware/wslink/compare/v1.2.0...v1.2.1) (2021-12-12)


### Bug Fixes

* **aiohttp:** register 30s heartbeat on ws ([2f0cc9a](https://github.com/kitware/wslink/commit/2f0cc9a212bfa5a538f5c34f62146e56fcf6fea8))

# [1.2.0](https://github.com/kitware/wslink/compare/v1.1.1...v1.2.0) (2021-12-06)


### Features

* **port=0:** Add infrastructure to handle dynamically assigned port ([eca3e23](https://github.com/kitware/wslink/commit/eca3e238d86c18fd28d99869fe4bd93138727ec0))

## [1.1.1](https://github.com/kitware/wslink/compare/v1.1.0...v1.1.1) (2021-11-19)


### Bug Fixes

* **attachments:** Better scheduleing for free ([289f3df](https://github.com/kitware/wslink/commit/289f3dfaf186ffc72a1e3fd4eeae538c81254792))

# [1.1.0](https://github.com/kitware/wslink/compare/v1.0.7...v1.1.0) (2021-10-15)


### Features

* **aiohttp:** Control max wslink msg with env var ([a30c5b2](https://github.com/kitware/wslink/commit/a30c5b2df908047a99ceed9d7fb89538ba251a94))

## [1.0.7](https://github.com/kitware/wslink/compare/v1.0.6...v1.0.7) (2021-08-25)


### Bug Fixes

* **cli:** Revert default host arg to localhost ([a39d8cf](https://github.com/kitware/wslink/commit/a39d8cf936d414c5aad21ed7bf590f791bfdb9ea))
* **static:** fix routes order definition for static content ([60457ab](https://github.com/kitware/wslink/commit/60457ab41bef4f0e6d1be94a605da0f6ea33b1a6))

## [1.0.6](https://github.com/kitware/wslink/compare/v1.0.5...v1.0.6) (2021-08-20)


### Bug Fixes

* **cli:** Update default --host arg to 0.0.0.0 ([ddbdda9](https://github.com/kitware/wslink/commit/ddbdda9af0b0cf05cfb4e660633d9c77d20f9e01))

## [1.0.5](https://github.com/kitware/wslink/compare/v1.0.4...v1.0.5) (2021-08-13)


### Bug Fixes

* **python:** prevent raise condition when sending attachements ([667e68e](https://github.com/kitware/wslink/commit/667e68e947d4e6b6ef253cfc06891fd703e0c592))

## [1.0.4](https://github.com/kitware/wslink/compare/v1.0.3...v1.0.4) (2021-08-10)


### Bug Fixes

* **JavaScript:** SmartConnector default decorator ([2973c8f](https://github.com/kitware/wslink/commit/2973c8f0038f6a5f4106820fae833aeea24ed281))

## [1.0.3](https://github.com/kitware/wslink/compare/v1.0.2...v1.0.3) (2021-08-10)


### Bug Fixes

* **javascript:** smartConnect will apply a default config decorator ([11ce5a6](https://github.com/kitware/wslink/commit/11ce5a66372bd338080a8527b2e8c8268ac8187b))
* **publish:** Only send publish msgs to each client once ([65ab38d](https://github.com/kitware/wslink/commit/65ab38dde2851dd8a590c4a0ccc967ba86f64bb1))

## [1.0.2](https://github.com/kitware/wslink/compare/v1.0.1...v1.0.2) (2021-08-10)


### Bug Fixes

* **http:** Automatically server index.html ([e43dde4](https://github.com/kitware/wslink/commit/e43dde43af797ed73f92d1b6a1b6adbd2078ea49))
* **scheduling:** Support scheduling tasks before server starts ([17c6750](https://github.com/kitware/wslink/commit/17c6750cc98424ae6e28067b08a34fbb428f19c1))

## [1.0.1](https://github.com/kitware/wslink/compare/v1.0.0...v1.0.1) (2021-08-10)


### Bug Fixes

* **js:** Small code cleanup ([58e025e](https://github.com/kitware/wslink/commit/58e025efd4f4f3f6deca3c8b88a6046d601fe183))
* **Python:** Better isolate backends implementations ([457b181](https://github.com/kitware/wslink/commit/457b181840804831272c5820ce77dfccf16c3d6e))

# [1.0.0](https://github.com/kitware/wslink/compare/v0.1.10...v1.0.0) (2021-08-09)


### Bug Fixes

* **dependencies:** Move json5 from devDependencies to dependencies ([bcb2919](https://github.com/kitware/wslink/commit/bcb2919a54074acd1c1f5bca11210a38381dcfce))
* **dependencies:** update webpack for security updates. ([27d6744](https://github.com/kitware/wslink/commit/27d674431546f106db8d5a4c67beb79c479acefa))
* **deps:** Replace twisted/autobahn with asyncio/aiohttp ([2e804bb](https://github.com/kitware/wslink/commit/2e804bbde98c75f03a6268067ffd322c954644c2))
* **ProcessLauncher:** Allow user to provide custom http headers ([e831509](https://github.com/kitware/wslink/commit/e831509c7766c5315be1b3baf7c1ecf37c900d4f))
* **publish:** use manager to allow publish to all connected clients ([83b94ab](https://github.com/kitware/wslink/commit/83b94ab715c332f5a589d8649fa8bd80e879fcab))
* **python:** Automatic version handling ([964db33](https://github.com/kitware/wslink/commit/964db33dd806dafae2e7b7fd59e22aff521d1bb8))
* **python:** Fix exit methods ([a1627d0](https://github.com/kitware/wslink/commit/a1627d0d9b5784ba52efa1e915a2e7d283bd55fa))
* **SmartConnect:** Provide optional config decorator method ([9b6302f](https://github.com/kitware/wslink/commit/9b6302f68a1257cb834c1b4ab792a57853605edf))
* **twisted:** Update to 19.2.1 which is the same as PV ([b732f97](https://github.com/kitware/wslink/commit/b732f97dec10774d51342bbbeb5696ae37d6aa08))
* **version:** Update version to 0.1.12 ([71f8cce](https://github.com/kitware/wslink/commit/71f8cced0648b0729dcc9247fa31342016e86cbe))
* **version:** Update version to 0.1.13 ([6cc5441](https://github.com/kitware/wslink/commit/6cc544151079587228760eb8ccdf2ad5a7745c0e))
* **websocket:** allow publish before connect, as a no-op ([10bef95](https://github.com/kitware/wslink/commit/10bef955b826ff7bf678f19dfe02972f83844ba9))


### BREAKING CHANGES

* **deps:** remove Py2 support and switch to aiohttp server

Re-implement the back-end using the websocket server implementation
from aiohttp, while leaving open the possibility of swapping out other
backends down the road.
