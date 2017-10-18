var ci = require("cla/ci");

ci.createRole("Docker");

ci.createClass("DockerInstance", {
    form: '/plugin/cla-docker-plugin/form/docker-instance.js',
    icon: '/plugin/cla-docker-plugin/icon/logo-docker.svg',
    roles: ["Docker", "ClariveSE"],
    has: {
        server: {
            is: "rw",
            isa: "ArrayRef",
            required: true
        },
        id: {
            is: "rw",
            isa: "Str",
            required: true
        }
    },
    methods: {
        terminate: function () {
            var log = require("cla/log");
            var ci = require("cla/ci");

            var server = this.server();
            var serverCi = ci.load(server[0]);

            var agent = serverCi.connect();
            var execute = agent.execute('docker stop ' + this.id());

            log.info(_("Container ") + this.id() + _(" terminated"));

            return 1;
        }
    }
});