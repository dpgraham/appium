## Appium 简介

Appium 是一款开源工具,，用于自动化 iOS、Android 和 Windows 桌面平台上的原生、web 和混合应用程序。 **原生应用**指那些用 iOS 、 Android 或者 Windows SDK 编写的应用程序。 **web 应用程序**是指使用移动端浏览器访问的应用（Appuium 支持 iOS 、 Chrome 或 Android 上构建的“浏览器”应用）。 **混合应用**带有一个 "webview" 的包装器——用来和 Web 内容交互的原生控件。 类似 [Phonegap](http://phonegap.com/) 的项目，让用 Web 技术开发然后打包进原生包装器创建一个混合应用变得容易了。

重要的是, Appium 是 "跨平台": 它允许您使用相同的 API 对 多个平台 (iOS、Android、Windows) 进行测试。 这将在 iOS、Android 和 Windows 测试套件之间实现 代码重用。

了解 Appium “支持”这些平台意味着什么、有哪些自动化方式的详细信息，请参见 [Appium 支持的平台](/docs/en/about-appium/platform-support.md)。

### Appium 哲学理念

该应用程序旨在根据以下四项原则概述的满足移动自动化需要：

1. 你没有必要为了自动化而重新编译你的应用或者以任何方式修改它。
2. 你不应该被限制在特定的语言或框架上来编写运行测试。
3. 移动端自动化框架在自动化接口方面不应该重造轮子。
4. 移动端自动化框架应该开源，不但在名义上而且在精神和实践上都要实至名归。

### Appium 设计理念

那么 Appium 项目的架构如何实现这一理念呢？ 为了实现第一点要求，我们其实使用了系统自带的自动化框架。 这样，我们不需要把 Appium 特定的或者第三方的代码编译进你的应用。这意味着**你测试使用的应用与最终发布的应用并无二致**。 我们使用以下系统自带的自动化框架：

* iOS 9.3 及以上：苹果的 [XCUITest](https://developer.apple.com/reference/xctest)
* iOS 9.3 及以下：苹果的 [UIAutomation](https://developer.apple.com/library/ios/documentation/DeveloperTools/Reference/UIAutomationRef/)
* Android 4.2+: 谷歌的 [UiAutomator/UiAutomator2](http://developer.android.com/tools/help/uiautomator/index.html)
* Android 2.3+: 谷歌的 [Instrumentation](http://developer.android.com/reference/android/app/Instrumentation.html). （通过绑定另外的项目—— [Selendroid](http://selendroid.io) 提供 Instrumentation 的支持）
* Windows: 微软的 [WinAppDriver](http://github.com/microsoft/winappdriver)

为了实现第二点要求，我们把这些（系统本身的）供应商提供的框架包装进一套 API —— [WebDriver](http://docs.seleniumhq.org/projects/webdriver/) API 中。 WebDriver（也叫 "Selenium WebDriver"）规定了一个客户端-服务器协议（称为 [JSON Wire Protocol](https://w3c.github.io/webdriver/webdriver-spec.html)）， 按照这种客户端-服务器架构，可以使用任何语言编写的客户端向服务器发送适当的 HTTP 请求。 There are already [clients written in every popular programming language](http://appium.io/downloads). This also means that you're free to use whatever test runner and test framework you want; the client libraries are simply HTTP clients and can be mixed into your code any way you please. In other words, Appium & WebDriver clients are not technically "test frameworks" -- they are "automation libraries". You can manage your test environment any way you like!

We meet requirement #3 in the same way: WebDriver has become the de facto standard for automating web browsers, and is a [W3C Working Draft](https://dvcs.w3.org/hg/webdriver/raw-file/tip/webdriver-spec.html). Why do something totally different for mobile? Instead we have [extended the protocol](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md) with extra API methods useful for mobile automation.

It should be obvious that requirement #4 is a given -- you're reading this because [Appium is open source](https://github.com/appium/appium).

### Appium Concepts

**Client/Server Architecture**  
Appium is at its heart a webserver that exposes a REST API. It receives connections from a client, listens for commands, executes those commands on a mobile device, and responds with an HTTP response representing the result of the command execution. The fact that we have a client/server architecture opens up a lot of possibilities: we can write our test code in any language that has a http client API, but it is easier to use one of the [Appium client libraries](http://appium.io/downloads). We can put the server on a different machine than our tests are running on. We can write test code and rely on a cloud service like [Sauce Labs](https://saucelabs.com/mobile) to receive and interpret the commands.

**Session**  
Automation is always performed in the context of a session. Clients initiate a session with a server in ways specific to each library, but they all end up sending a `POST /session` request to the server, with a JSON object called the 'desired capabilities' object. At this point the server will start up the automation session and respond with a session ID which is used for sending further commands.

**Desired Capabilities**  
Desired capabilities are a set of keys and values (i.e., a map or hash) sent to the Appium server to tell the server what kind of automation session we're interested in starting up. There are also various capabilities which can modify the behavior of the server during automation. For example, we might set the `platformName` capability to `iOS` to tell Appium that we want an iOS session, rather than an Android or Windows one. Or we might set the `safariAllowPopups` capability to `true` in order to ensure that, during a Safari automation session, we're allowed to use JavaScript to open up new windows. See the [capabilities doc](/docs/en/writing-running-appium/caps.md) for the complete list of capabilities available for Appium.

**Appium Server**  
Appium is a server written in Node.js. It can be built and installed [from source](/docs/en/contributing-to-appium/appium-from-source.md) or installed directly from NPM:

    $ npm install -g appium
    $ appium
    

**Appium Clients**  
There are client libraries (in Java, Ruby, Python, PHP, JavaScript, and C#) which support Appium's extensions to the WebDriver protocol. When using Appium, you want to use these client libraries instead of your regular WebDriver client. You can view the full list of libraries [here](/docs/en/about-appium/appium-clients.md).

**[Appium Desktop](https://github.com/appium/appium-desktop)**  
There is a GUI wrapper around the Appium server that can be downloaded for any platform. It comes bundled with everything required to run the Appium server, so you don't need to worry about Node. It also comes with an Inspector, which enables you to check out the hierarchy of your app. This can come in handy when writing tests.

### Getting Started

Congratulations! You are now armed with enough knowledge to begin using Appium. Why not head to the [getting started doc](/docs/en/about-appium/getting-started.md) for more detailed requirements and instructions?